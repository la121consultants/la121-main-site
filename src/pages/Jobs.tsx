import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MapPin, Clock, DollarSign, Star, Search, Plus, Building2, Send, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { User } from '@supabase/supabase-js';

interface JobPosting {
  id: string;
  company_name: string;
  job_title: string;
  job_location: string;
  job_type: string;
  salary_range: string | null;
  job_description: string;
  requirements: string | null;
  benefits: string | null;
  featured: boolean;
  created_at: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applying, setApplying] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '', companyEmail: '', companyWebsite: '', jobTitle: '', jobLocation: '',
    jobType: '', salaryRange: '', jobDescription: '', requirements: '', benefits: '',
    applicationEmail: '', applicationUrl: '',
  });

  const [applicationData, setApplicationData] = useState({ coverLetter: '', phone: '' });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { fetchJobs(); }, []);
  useEffect(() => { filterJobs(); }, [searchTerm, locationFilter, typeFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase.from('job_postings').select('*').eq('status', 'approved')
        .order('featured', { ascending: false }).order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []); setFilteredJobs(data || []);
    } catch (error: any) { toast.error('Failed to load jobs'); } finally { setLoading(false); }
  };

  const filterJobs = () => {
    let filtered = jobs;
    if (searchTerm) filtered = filtered.filter(job => 
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (locationFilter !== 'all') filtered = filtered.filter(job => 
      job.job_location.toLowerCase().includes(locationFilter.toLowerCase())
    );
    if (typeFilter !== 'all') filtered = filtered.filter(job => job.job_type === typeFilter);
    setFilteredJobs(filtered);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedJob) return;
    setApplying(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('full_name, email, phone')
        .eq('user_id', user.id).single();
      if (!profile) { toast.error('Profile not found'); navigate('/dashboard'); return; }
      
      const { error } = await supabase.from('job_applications').insert({
        user_id: user.id, job_posting_id: selectedJob.id, applicant_name: profile.full_name,
        applicant_email: profile.email, applicant_phone: applicationData.phone || profile.phone,
        cover_letter: applicationData.coverLetter, status: 'submitted',
      });
      if (error) { if (error.code === '23505') toast.error('Already applied'); else throw error; return; }
      toast.success('Application submitted!'); setShowApplyDialog(false);
    } catch (error: any) { toast.error('Failed to submit'); } finally { setApplying(false); }
  };

  const handleApplyClick = (job: JobPosting) => {
    if (!user) { toast.error('Please sign in to apply'); navigate('/auth'); return; }
    setSelectedJob(job); setShowApplyDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Job Board</h1>
            <p className="text-xl text-muted-foreground mb-8">Discover career opportunities</p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Megaphone className="h-6 w-6" />
              </div>
              <p className="text-lg leading-relaxed text-foreground">
                If you would like to advertise your jobs on our Jobs Board, please fill in our{' '}
                <a href="/partnership" className="font-semibold text-primary hover:underline">Partnerships form</a>{' '}
                or email us at{' '}
                <a href="mailto:admin@la121consultants.co.uk" className="font-semibold text-primary hover:underline">
                  admin@la121consultants.co.uk
                </a>
                .
              </p>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger><MapPin className="w-4 h-4 mr-2" /><SelectValue placeholder="All Locations" /></SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="london">London</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><Clock className="w-4 h-4 mr-2" /><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Building2 className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{job.job_title}</h3>
                          <p className="text-muted-foreground">{job.company_name}</p>
                        </div>
                        {job.featured && <Badge><Star className="w-3 h-3 mr-1" />Featured</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.job_location}</div>
                        <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.job_type}</div>
                        {job.salary_range && <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salary_range}</div>}
                      </div>
                    </div>
                    <Button onClick={() => handleApplyClick(job)} className="gap-2">
                      <Send className="w-4 h-4" />Quick Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob.job_title}</DialogTitle>
                <DialogDescription>at {selectedJob.company_name}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApply} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={applicationData.phone} 
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea id="coverLetter" rows={8} value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Jobs;
