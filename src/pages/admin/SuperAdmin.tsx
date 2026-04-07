import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, isSameDay, subDays } from 'date-fns';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Download, BarChart3, ShieldCheck, Users, Briefcase, PhoneCall, BookOpen } from 'lucide-react';

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  service_interest: string;
  start_time: string;
  end_time: string;
  zoom_join_url: string | null;
  duration_minutes?: number;
}

interface EbookLead {
  id: string;
  created_at: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface PartnershipSubmission {
  id: string;
  status: string;
  service_selected: string | null;
  additional_notes: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    how_found_us?: string | null;
  } | null;
}

interface Metrics {
  totalUsers: number;
  dailyActive: number;
  cvToolUsers: number;
  bioToolUsers: number;
}

interface TrendPoint {
  date: string;
  signups: number;
  logins: number;
}

const sectionLinks = [
  { id: 'analytics', label: 'Website Analytics' },
  { id: 'strategy', label: 'Strategy Calls' },
  { id: 'partnerships', label: 'Partnerships' },
  { id: 'ebook-leads', label: 'Free Ebook Leads' },
  { id: 'jobs', label: 'Jobs Board' },
];

const SuperAdmin = () => {
  const { isSuperAdmin, loading: superLoading } = useSuperAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    dailyActive: 0,
    cvToolUsers: 0,
    bioToolUsers: 0,
  });
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [popularPages, setPopularPages] = useState<{ label: string; count: number }[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultationFilters, setConsultationFilters] = useState({ start: '', end: '' });
  const [partnerships, setPartnerships] = useState<PartnershipSubmission[]>([]);
  const [partnershipStatus, setPartnershipStatus] = useState('all');
  const [ebookLeads, setEbookLeads] = useState<EbookLead[]>([]);
  const [jobSnapshot, setJobSnapshot] = useState({ total: 0, approved: 0, pending: 0, featured: 0 });

  useEffect(() => {
    if (!superLoading && !isSuperAdmin) {
      toast.error('Super admin only', {
        description: 'The requested dashboard is restricted to the primary super admin account.',
      });
      navigate('/admin/dashboard');
    }
  }, [isSuperAdmin, navigate, superLoading]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const lastDay = subDays(new Date(), 1).toISOString();

      const [
        totalUsers,
        dailyActive,
        recentProfiles,
        submissions,
        cvTool,
        bioTool,
        partnershipRes,
        ebookRes,
        jobRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('last_login', lastDay),
        supabase
          .from('profiles')
          .select('created_at, last_login')
          .gte('created_at', subDays(new Date(), 14).toISOString()),
        supabase.from('form_submissions').select('form_type, service_selected, created_at'),
        supabase
          .from('form_submissions')
          .select('id', { count: 'exact', head: true })
          .ilike('service_selected', '%cv%'),
        supabase
          .from('form_submissions')
          .select('id', { count: 'exact', head: true })
          .ilike('service_selected', '%bio%'),
        supabase
          .from('form_submissions')
          .select(
            'id, service_selected, additional_notes, status, created_at, profiles:profile_id(full_name, email, how_found_us)'
          )
          .eq('form_type', 'partnership')
          .order('created_at', { ascending: false }),
        supabase
          .from('form_submissions')
          .select('id, status, created_at, profiles:profile_id(full_name, email)')
          .eq('form_type', 'free_ebook_international')
          .order('created_at', { ascending: false }),
        supabase.from('job_postings').select('status, featured'),
      ]);

      setMetrics({
        totalUsers: totalUsers.count || 0,
        dailyActive: dailyActive.count || 0,
        cvToolUsers: cvTool.count || 0,
        bioToolUsers: bioTool.count || 0,
      });

      setTrendData(buildTrendData(recentProfiles.data || []));
      setPopularPages(buildPopularPages(submissions.data || []));
      setConsultations([]);
      setPartnerships((partnershipRes.data as PartnershipSubmission[]) || []);
      setEbookLeads((ebookRes.data as EbookLead[]) || []);

      const jobData = jobRes.data || [];
      setJobSnapshot({
        total: jobData.length,
        approved: jobData.filter((job) => job.status === 'approved').length,
        pending: jobData.filter((job) => job.status === 'pending').length,
        featured: jobData.filter((job) => job.featured).length,
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to load super admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin, loadData]);

  const buildTrendData = (profiles: { created_at: string; last_login: string | null }[]) => {
    const days = Array.from({ length: 7 }).map((_, idx) => subDays(new Date(), 6 - idx));

    return days.map((day) => {
      const signups = profiles.filter((profile) => isSameDay(new Date(profile.created_at), day)).length;
      const logins = profiles.filter(
        (profile) => profile.last_login && isSameDay(new Date(profile.last_login), day)
      ).length;

      return {
        date: format(day, 'EEE'),
        signups,
        logins,
      };
    });
  };

  const buildPopularPages = (
    submissions: { form_type: string; service_selected: string | null }[]
  ) => {
    const counts: Record<string, number> = {};

    submissions.forEach((submission) => {
      const label =
        submission.form_type === 'client_call'
          ? 'Strategy Call'
          : submission.form_type === 'service_order'
            ? 'Services'
            : 'Partnerships';

      counts[label] = (counts[label] || 0) + 1;
    });

    const entries = Object.entries(counts).map(([label, count]) => ({ label, count }));

    return entries.length
      ? entries
      : [
          { label: 'Homepage', count: 0 },
          { label: 'Services', count: 0 },
          { label: 'Jobs Board', count: 0 },
        ];
  };

  const filteredConsultations = useMemo(() => {
    return consultations.filter((consultation) => {
      const startOk =
        !consultationFilters.start ||
        new Date(consultation.start_time) >= new Date(consultationFilters.start);
      const endOk =
        !consultationFilters.end ||
        new Date(consultation.start_time) <= new Date(consultationFilters.end);
      return startOk && endOk;
    });
  }, [consultationFilters.end, consultationFilters.start, consultations]);

  const filteredPartnerships = useMemo(() => {
    return partnerships.filter(
      (submission) => partnershipStatus === 'all' || submission.status === partnershipStatus
    );
  }, [partnershipStatus, partnerships]);

  const exportToCsv = (rows: Record<string, string>[], filename: string) => {
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(',')]
      .concat(rows.map((row) => headers.map((key) => `"${row[key] || ''}"`).join(',')))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportConsultations = () => {
    const rows = filteredConsultations.map((booking) => ({
      Name: booking.full_name,
      Email: booking.email,
      Phone: booking.phone || '',
      Service: booking.service_interest,
      Start: format(new Date(booking.start_time), 'PPpp'),
      End: format(new Date(booking.end_time), 'PPpp'),
      Zoom: booking.zoom_join_url || '',
    }));

    if (rows.length === 0) {
      toast.message('No bookings to export');
      return;
    }

    exportToCsv(rows, 'strategy-calls.csv');
  };

  const exportEbookLeads = () => {
    const rows = ebookLeads.map((lead) => ({
      Name: lead.profiles?.full_name || 'Unknown',
      Email: lead.profiles?.email || 'Unknown',
      Status: lead.status,
      Submitted: format(new Date(lead.created_at), 'PPpp'),
    }));

    if (rows.length === 0) {
      toast.message('No ebook leads to export');
      return;
    }

    exportToCsv(rows, 'free-ebook-leads.csv');
  };

  const exportPartnerships = () => {
    const rows = filteredPartnerships.map((submission) => ({
      Name: submission.profiles?.full_name || 'Unknown',
      Email: submission.profiles?.email || 'Unknown',
      Company: submission.service_selected || submission.profiles?.how_found_us || 'Not provided',
      Message: submission.additional_notes || '',
      Status: submission.status,
      Submitted: format(new Date(submission.created_at), 'PPpp'),
    }));

    if (rows.length === 0) {
      toast.message('No partnership enquiries to export');
      return;
    }

    exportToCsv(rows, 'partnership-enquiries.csv');
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setPartnerships((prev) =>
        prev.map((submission) =>
          submission.id === id ? { ...submission, status } : submission
        )
      );
      toast.success('Partnership status updated');
    } catch (error) {
      console.error(error);
      toast.error('Unable to update status');
    }
  };

  const partnershipStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary">Super Admin</p>
            <h1 className="text-3xl font-bold tracking-tight">Control Centre</h1>
            <p className="text-muted-foreground">
              Centralised access to analytics, bookings, partnerships, and the jobs board.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sectionLinks.map((link) => (
              <Button key={link.id} variant="outline" size="sm" asChild>
                <a href={`#${link.id}`}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>

        <section id="analytics" className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Website User Analytics</h2>
              <p className="text-muted-foreground text-sm">Realtime visibility into user engagement and tool usage.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <CardDescription>Registered profiles</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{metrics.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                <CardDescription>Past 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <BarChart3 className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{metrics.dailyActive}</p>
                  <p className="text-xs text-muted-foreground">Signed in recently</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CV Tool Users</CardTitle>
                <CardDescription>Detected via submissions</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3">
                  <Badge className="bg-blue-600 text-white">CV</Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold">{metrics.cvToolUsers}</p>
                  <p className="text-xs text-muted-foreground">Active interest</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bio Tool Users</CardTitle>
                <CardDescription>Detected via submissions</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-3">
                  <Badge className="bg-purple-600 text-white">Bio</Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold">{metrics.bioToolUsers}</p>
                  <p className="text-xs text-muted-foreground">Profile creators</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Engagement over the last week</CardTitle>
                <CardDescription>Sign ups vs return logins</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="signups" stroke="#2563eb" strokeWidth={2} />
                    <Line type="monotone" dataKey="logins" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Most visited funnels</CardTitle>
                <CardDescription>Derived from recent form activity</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularPages} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="strategy" className="space-y-4">
          <div className="flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Strategy Call Bookings</h2>
              <p className="text-muted-foreground text-sm">Filter and export every consultation booking.</p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Bookings ({filteredConsultations.length})</CardTitle>
                <CardDescription>Includes Zoom links and chosen services</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Input
                  type="date"
                  value={consultationFilters.start}
                  onChange={(e) => setConsultationFilters({ ...consultationFilters, start: e.target.value })}
                  className="w-[160px]"
                />
                <Input
                  type="date"
                  value={consultationFilters.end}
                  onChange={(e) => setConsultationFilters({ ...consultationFilters, end: e.target.value })}
                  className="w-[160px]"
                />
                <Button variant="outline" size="sm" onClick={() => setConsultationFilters({ start: '', end: '' })}>
                  Clear
                </Button>
                <Button variant="secondary" size="sm" onClick={exportConsultations}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Booking Time</TableHead>
                    <TableHead>Zoom</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.full_name}</TableCell>
                      <TableCell>{booking.email}</TableCell>
                      <TableCell>{booking.service_interest}</TableCell>
                      <TableCell>{format(new Date(booking.start_time), 'PPpp')}</TableCell>
                      <TableCell>
                        {booking.zoom_join_url ? (
                          <a
                            href={booking.zoom_join_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            Join link
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not generated</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="partnerships" className="space-y-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Partnerships Enquiries</h2>
              <p className="text-muted-foreground text-sm">Track submissions and progress them to completion.</p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Enquiries ({filteredPartnerships.length})</CardTitle>
                <CardDescription>Includes status controls and export tools</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={partnershipStatus} onValueChange={setPartnershipStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="secondary" size="sm" onClick={exportPartnerships}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartnerships.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.profiles?.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell>{submission.profiles?.email || 'Unknown'}</TableCell>
                      <TableCell>
                        {submission.service_selected || submission.profiles?.how_found_us || 'Not provided'}
                      </TableCell>
                      <TableCell className="max-w-md text-sm text-muted-foreground">
                        {submission.additional_notes || 'No message provided'}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={submission.status}
                          onValueChange={(value) => updatePartnershipStatus(submission.id, value)}
                        >
                          <SelectTrigger className={`w-[140px] ${partnershipStatusColor(submission.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{format(new Date(submission.created_at), 'PP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="ebook-leads" className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold">Free Ebook Leads — International Students</h2>
              <p className="text-muted-foreground text-sm">Name, email and phone of every international student who downloaded the free ebook.</p>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Leads ({ebookLeads.length})</CardTitle>
                <CardDescription>All submissions from the homepage free ebook banner</CardDescription>
              </div>
              <Button variant="secondary" size="sm" onClick={exportEbookLeads}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ebookLeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                        No ebook leads yet
                      </TableCell>
                    </TableRow>
                  )}
                  {ebookLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.profiles?.full_name || 'Unknown'}</TableCell>
                      <TableCell>
                        <a href={`mailto:${lead.profiles?.email}`} className="text-primary hover:underline">
                          {lead.profiles?.email || 'Unknown'}
                        </a>
                      </TableCell>
                      <TableCell>{format(new Date(lead.created_at), 'PP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section id="jobs" className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Jobs Board Management</h2>
              <p className="text-muted-foreground text-sm">
                Quick snapshot of postings with a shortcut to full management.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{jobSnapshot.total}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-green-600">
                {jobSnapshot.approved}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-amber-600">
                {jobSnapshot.pending}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Featured Roles</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold text-primary">
                {jobSnapshot.featured}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Manage the Jobs Board</CardTitle>
                <CardDescription>Add, edit, or approve listings with the full toolset.</CardDescription>
              </div>
              <Button onClick={() => navigate('/admin/jobs')}>Open Jobs Dashboard</Button>
            </CardHeader>
          </Card>
        </section>

        {loading && (
          <div className="text-center text-muted-foreground">Loading super admin insights...</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SuperAdmin;
