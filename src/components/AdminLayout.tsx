import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Star,
  Package,
  FileText,
  BookOpen,
  Settings,
  FileCheck,
  LogOut,
  Loader2,
  Users,
  ClipboardList,
  BarChart3,
  Shield,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, loading } = useAdmin();
  const { isSuperAdmin } = useSuperAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error('Access denied', {
        description: 'You do not have admin privileges',
      });
      navigate('/admin');
    }
  }, [isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/admin');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: LayoutDashboard, label: 'Super Admin', path: '/admin/super', superAdminOnly: true },
    { icon: Users, label: 'Website Users', path: '/admin/users' },
    { icon: ClipboardList, label: 'Form Submissions', path: '/admin/submissions' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Package, label: 'Job Postings', path: '/admin/jobs' },
    { icon: Shield, label: 'Admin Users', path: '/admin/users-management', superAdminOnly: true },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: Package, label: 'Services', path: '/admin/services' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: BookOpen, label: 'E-Books', path: '/admin/ebooks' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: FileCheck, label: 'Audit Log', path: '/admin/audit' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground">LA121 Admin</h2>
          <p className="text-sm text-muted-foreground">Content Management</p>
        </div>
        <Separator />
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {menuItems
              .filter((item) => !item.superAdminOnly || isSuperAdmin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
