import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';
import { UserPlus, Trash2, Shield, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
  last_sign_in_at?: string;
}

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const navigate = useNavigate();
  const { isSuperAdmin, loading: superAdminLoading, superAdminEmail } = useSuperAdmin();

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Super admin access required', {
        description: 'Only the designated super admin can manage admin accounts.',
      });
      navigate('/admin/dashboard');
    }
  }, [isSuperAdmin, navigate, superAdminLoading]);

  const fetchAdminUsers = useCallback(async () => {
    if (!isSuperAdmin) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .in('role', ['admin', 'super_admin'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithDetails = await Promise.all(
        (data || []).map(async (role) => {
          const { data: { user } } = await supabase.auth.admin.getUserById(role.user_id);
          return {
            ...role,
            email: user?.email,
            last_sign_in_at: user?.last_sign_in_at,
          };
        })
      );

      setAdminUsers(usersWithDetails);
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to load admin users', {
        description,
      });
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdminUsers();
    }
  }, [fetchAdminUsers, isSuperAdmin]);

  const handleAddUser = async () => {
    if (!isSuperAdmin) return;

    if (newUserEmail.toLowerCase() === superAdminEmail) {
      toast.error('Cannot reuse super admin email', {
        description: 'The primary super admin account already exists and cannot be recreated.',
      });
      return;
    }

    if (!newUserEmail || !newUserPassword) {
      toast.error('Email and password are required');
      return;
    }

    try {
      setLoading(true);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
      });

      if (authError) throw authError;

      // Add role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'admin',
        });

      if (roleError) throw roleError;

      toast.success('Admin user added successfully');
      setShowAddDialog(false);
      setNewUserEmail('');
      setNewUserPassword('');
      fetchAdminUsers();
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to add admin user', {
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !isSuperAdmin) return;

    if (selectedUser.email?.toLowerCase() === superAdminEmail) {
      toast.error('Super admin account is protected');
      setShowDeleteDialog(false);
      return;
    }

    try {
      setLoading(true);

      // Delete role
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', selectedUser.id);

      if (roleError) throw roleError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        selectedUser.user_id
      );

      if (authError) throw authError;

      toast.success('Admin user deleted successfully');
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchAdminUsers();
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast.error('Failed to delete admin user', {
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
            <p className="text-muted-foreground">Manage admin access and permissions</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Users List</CardTitle>
            <CardDescription>
              View and manage all users with admin access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => {
                    const isPrimarySuperAdmin =
                      user.email?.toLowerCase() === superAdminEmail || user.role === 'super_admin';

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={isPrimarySuperAdmin ? 'secondary' : 'default'}>
                            {isPrimarySuperAdmin ? (
                              <Crown className="mr-1 h-3 w-3" />
                            ) : (
                              <Shield className="mr-1 h-3 w-3" />
                            )}
                            {isPrimarySuperAdmin ? 'super_admin' : user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at
                            ? format(new Date(user.last_sign_in_at), 'PPp')
                            : 'Never'}
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), 'PP')}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPrimarySuperAdmin}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Add Admin User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>
              Create a new admin user with access to the dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Strong password"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              New accounts will be provisioned with <span className="font-medium text-primary">admin</span> access only.
              Super admin privileges remain exclusive to {superAdminEmail}.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={loading}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the admin user "{selectedUser?.email}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
