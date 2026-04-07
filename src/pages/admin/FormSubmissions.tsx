import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Submission {
  id: string;
  form_type: string;
  service_selected: string | null;
  preferred_datetime: string | null;
  additional_notes: string | null;
  status: string;
  created_at: string;
  profile_id: string;
  profile?: {
    full_name: string;
    email: string;
    phone: string | null;
    linkedin_url: string | null;
  };
}

const parseNotes = (notes: string | null) => {
  if (!notes) return { name: '', email: '' };
  const name = notes.match(/Name:\s*(.+)/)?.[1]?.trim() || '';
  const email = notes.match(/Email:\s*(.+)/)?.[1]?.trim() || '';
  return { name, email };
};

const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filters, setFilters] = useState({
    formType: 'all',
    status: 'all',
    dateStart: '',
    dateEnd: '',
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, submissions]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select(`
          *,
          profile:profiles(full_name, email, phone, linkedin_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error: any) {
      toast.error('Failed to load submissions', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = submissions;

    if (filters.formType !== 'all') {
      filtered = filtered.filter((s) => s.form_type === filters.formType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters.dateStart) {
      filtered = filtered.filter(
        (s) => new Date(s.created_at) >= new Date(filters.dateStart)
      );
    }

    if (filters.dateEnd) {
      filtered = filtered.filter(
        (s) => new Date(s.created_at) <= new Date(filters.dateEnd)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status updated successfully');
      fetchSubmissions();
      setShowDetailsDialog(false);
    } catch (error: any) {
      toast.error('Failed to update status', {
        description: error.message,
      });
    }
  };

  const viewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetailsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Submissions</h1>
          <p className="text-muted-foreground">Track and manage all form submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter submissions by type, status, and date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Form Type</Label>
                <Select
                  value={filters.formType}
                  onValueChange={(value) => setFilters({ ...filters, formType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="client_call">Client Call</SelectItem>
                    <SelectItem value="service_order">Service Order</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="free_ebook_international">Free Ebook Download</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.dateStart}
                  onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.dateEnd}
                  onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => {
                    const parsed = parseNotes(submission.additional_notes);
                    const name = submission.profile?.full_name || parsed.name || 'N/A';
                    const email = submission.profile?.email || parsed.email || 'N/A';
                    return (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>
                        {email !== 'N/A' ? (
                          <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="capitalize">
                        {submission.form_type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>{submission.service_selected || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(submission.status) as any}>
                          {submission.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(submission.created_at), 'PP')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewDetails(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submission Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (() => {
            const parsed = parseNotes(selectedSubmission.additional_notes);
            const name = selectedSubmission.profile?.full_name || parsed.name || 'N/A';
            const email = selectedSubmission.profile?.email || parsed.email || 'N/A';
            return (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  {email !== 'N/A' ? (
                    <a href={`mailto:${email}`} className="text-base text-primary hover:underline">{email}</a>
                  ) : (
                    <p className="text-base">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedSubmission.profile?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
                  {selectedSubmission.profile?.linkedin_url ? (
                    <a
                      href={selectedSubmission.profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    <p className="text-base">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Form Type</p>
                  <p className="text-base capitalize">
                    {selectedSubmission.form_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service</p>
                  <p className="text-base">{selectedSubmission.service_selected || 'N/A'}</p>
                </div>
                {selectedSubmission.preferred_datetime && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preferred Date/Time</p>
                    <p className="text-base">
                      {format(new Date(selectedSubmission.preferred_datetime), 'PPp')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-base">
                    {format(new Date(selectedSubmission.created_at), 'PPp')}
                  </p>
                </div>
              </div>

              {selectedSubmission.additional_notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Additional Notes</p>
                  <p className="text-base p-3 bg-muted rounded-md">
                    {selectedSubmission.additional_notes}
                  </p>
                </div>
              )}

              <div>
                <Label>Update Status</Label>
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) => updateStatus(selectedSubmission.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FormSubmissions;
