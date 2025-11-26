import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SUPER_ADMIN_EMAIL } from '@/hooks/useSuperAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [superAdminLoading, setSuperAdminLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Login failed', {
          description: error.message,
        });
      } else {
        toast.success('Login successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        toast.error('Password reset failed', {
          description: error.message,
        });
      } else {
        toast.success('Password reset email sent', {
          description: 'Check your email for the reset link',
        });
        setResetMode(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSuperAdminLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    if (email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      toast.error('Super admin access restricted', {
        description: `Only ${SUPER_ADMIN_EMAIL} can unlock the super admin controls.`,
      });
      return;
    }

    setSuperAdminLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        throw error || new Error('Unable to sign in as super admin');
      }

      const { data: hasSuperAdminRole, error: roleError } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'super_admin',
      });

      if (roleError) {
        throw roleError;
      }

      if (!hasSuperAdminRole) {
        await supabase.auth.signOut();
        toast.error('Super admin access required', {
          description: 'This account does not have super admin privileges.',
        });
        return;
      }

      toast.success('Super admin login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Super admin login failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setSuperAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the LA121 Consultants admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {!resetMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (resetMode ? 'Sending...' : 'Signing in...') : (resetMode ? 'Send Reset Link' : 'Sign In')}
            </Button>
            {!resetMode && (
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSuperAdminLogin}
                disabled={superAdminLoading || loading}
              >
                {superAdminLoading ? 'Verifying super admin...' : 'Super Admin Login'}
              </Button>
            )}
            {!resetMode && (
              <p className="text-xs text-muted-foreground text-center">
                Reserved for the highest-level administrators with the{' '}
                <span className="font-medium text-primary">super_admin</span> role.
              </p>
            )}
            <Button
              type="button"
              variant="link"
              className="w-full text-sm"
              onClick={() => setResetMode(!resetMode)}
              disabled={loading}
            >
              {resetMode ? 'Back to login' : 'Forgot password?'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
