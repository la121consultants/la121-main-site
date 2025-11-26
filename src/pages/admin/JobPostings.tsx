import { useState, useEffect, useCallback } from 'react';
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
  DialogDescription,
  DialogFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye, CheckCircle, XCircle, Trash2, Star, Filter, Building2, MapPin, Edit, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';

interface JobPosting {
  id: string;
  company_name: string;
  company_email: string;
  company_website: string | null;
  job_title: string;
  job_location: string;
  job_type: string;
  salary_range: string | null;
  job_description: string;
  requirements: string | null;
  benefits: string | null;
  application_email: string;
  application_url: string | null;
  featured: boolean;
  status: string;
  views_count: number;
  created_at: string;
}

interface JobForm {
  job_title: string;
  company_name: string;
  job_location: string;
  job_type: string;
  salary_range: string;
  job_description: string;
  application_email: string;
  application_url: string;
}

const INITIAL_JOB_FORM: JobForm = {
  job_title: '',
  company_name: '',
  job_location: 'Remote',
  job_type: 'full-time',
  salary_range: '',
  job_description: '',
  application_email: '',
  application_url: '',
};

const JobPostings = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobForm, setJobForm] = useState<JobForm>(INITIAL_JOB_FORM);

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = jobs;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, statusFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to load job postings', { description });
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingJob(null);
    setJobForm(INITIAL_JOB_FORM);
    setShowJobForm(true);
  };

  const openEditForm = (job: JobPosting) => {
    setEditingJob(job);
    setJobForm({
      job_title: job.job_title,
      company_name: job.company_name,
      job_location: job.job_location,
      job_type: job.job_type,
      salary_range: job.salary_range || '',
      job_description: job.job_description,
      application_email: job.application_email,
      application_url: job.application_url || '',
    });
    setShowJobForm(true);
  };

  const handleSaveJob = async () => {
    if (!jobForm.job_title || !jobForm.company_name || !jobForm.job_description || !jobForm.application_email) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);

      if (editingJob) {
        const { error } = await supabase
          .from('job_postings')
          .update({
            job_title: jobForm.job_title,
            company_name: jobForm.company_name,
            company_email: jobForm.application_email,
            job_location: jobForm.job_location,
            job_type: jobForm.job_type,
            salary_range: jobForm.salary_range || null,
            job_description: jobForm.job_description,
            application_email: jobForm.application_email,
            application_url: jobForm.application_url || null,
          })
          .eq('id', editingJob.id);

        if (error) throw error;
        toast.success('Job updated successfully');
      } else {
        const { error } = await supabase.from('job_postings').insert([
          {
            company_name: jobForm.company_name,
            company_email: jobForm.application_email,
            company_website: null,
            job_title: jobForm.job_title,
            job_location: jobForm.job_location,
            job_type: jobForm.job_type,
            salary_range: jobForm.salary_range || null,
            job_description: jobForm.job_description,
            requirements: null,
            benefits: null,
            application_email: jobForm.application_email,
            application_url: jobForm.application_url || null,
            status: 'approved',
            featured: false,
          },
        ]);

        if (error) throw error;
        toast.success('Job added to the board');
      }

      setShowJobForm(false);
      setEditingJob(null);
      setJobForm(INITIAL_JOB_FORM);
      fetchJobs();
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Unable to save job posting', {
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Job ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchJobs();
      setShowDetailsDialog(false);
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to update job status', { description });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ featured: !featured })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Job ${!featured ? 'featured' : 'unfeatured'} successfully`);
      fetchJobs();
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to update featured status', { description });
    }
  };

  const deleteJob = async () => {
    if (!selectedJob) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', selectedJob.id);

      if (error) throw error;

      toast.success('Job posting deleted successfully');
      fetchJobs();
      setShowDeleteDialog(false);
      setSelectedJob(null);
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to delete job posting', { description });
    }
  };

  const viewDetails = (job: JobPosting) => {
    setSelectedJob(job);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
            <p className="text-muted-foreground">Manage job board submissions and postings</p>
          </div>
          <Button onClick={openCreateForm}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.featured).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Listings ({filteredJobs.length})</CardTitle>
            <CardDescription>Review and manage all job postings</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {job.featured && <Star className="h-4 w-4 text-primary fill-primary" />}
                          {job.job_title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {job.company_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {job.job_location}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{job.job_type.replace('-', ' ')}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job.views_count}</TableCell>
                      <TableCell>{format(new Date(job.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => viewDetails(job)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditForm(job)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured(job.id, job.featured)}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                job.featured ? 'fill-primary text-primary' : ''
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Job Dialog */}
      <Dialog
        open={showJobForm}
        onOpenChange={(open) => {
          setShowJobForm(open);
          if (!open) {
            setEditingJob(null);
            setJobForm(INITIAL_JOB_FORM);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job' : 'Add Job'}</DialogTitle>
            <DialogDescription>
              {editingJob
                ? 'Update the listing details shown on the public jobs board.'
                : 'Create a new opening with all the essential information.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                value={jobForm.job_title}
                onChange={(e) => setJobForm({ ...jobForm, job_title: e.target.value })}
                placeholder="Senior Product Manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={jobForm.company_name}
                onChange={(e) => setJobForm({ ...jobForm, company_name: e.target.value })}
                placeholder="LA121 Consultants"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={jobForm.job_location}
                onValueChange={(value) => setJobForm({ ...jobForm, job_location: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select
                value={jobForm.job_type}
                onValueChange={(value) => setJobForm({ ...jobForm, job_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salary Range</Label>
              <Input
                value={jobForm.salary_range}
                onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                placeholder="$80,000 - $95,000"
              />
            </div>
            <div className="space-y-2">
              <Label>Application Email</Label>
              <Input
                type="email"
                value={jobForm.application_email}
                onChange={(e) => setJobForm({ ...jobForm, application_email: e.target.value })}
                placeholder="talent@company.com"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Application Link (optional)</Label>
              <Input
                type="url"
                value={jobForm.application_url}
                onChange={(e) => setJobForm({ ...jobForm, application_url: e.target.value })}
                placeholder="https://company.com/apply"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Job Description</Label>
              <Textarea
                rows={5}
                value={jobForm.job_description}
                onChange={(e) => setJobForm({ ...jobForm, job_description: e.target.value })}
                placeholder="Outline responsibilities, requirements, and benefits."
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              Posting date will be captured automatically when the role is saved.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowJobForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveJob} disabled={loading}>
                {editingJob ? 'Save Changes' : 'Add Job'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Posting Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                  <p className="text-base font-semibold">{selectedJob.job_title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-base">{selectedJob.company_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{selectedJob.job_location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base capitalize">{selectedJob.job_type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Salary</p>
                  <p className="text-base">{selectedJob.salary_range || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedJob.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company Email</p>
                  <p className="text-base">{selectedJob.company_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Application Email</p>
                  <p className="text-base">{selectedJob.application_email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm whitespace-pre-wrap">{selectedJob.job_description}</p>
              </div>

              {selectedJob.requirements && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Requirements</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedJob.requirements}</p>
                </div>
              )}

              {selectedJob.benefits && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Benefits</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedJob.benefits}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedJob.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => updateJobStatus(selectedJob.id, 'approved')}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateJobStatus(selectedJob.id, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedJob.status === 'approved' && (
                  <Button
                    onClick={() => updateJobStatus(selectedJob.id, 'expired')}
                    variant="outline"
                    className="flex-1"
                  >
                    Mark as Expired
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job posting "{selectedJob?.job_title}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteJob} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default JobPostings;
