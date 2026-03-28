import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Star, Package, FileText, BookOpen, Download, Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingReviews: 0,
    activeServices: 0,
    draftPosts: 0,
    totalEbooks: 0,
    totalDownloads: 0,
    pageViewsWeek: 0,
  });
  const [topPages, setTopPages] = useState<{ page_path: string; count: number }[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<{ ebook_title: string; customer_email: string; created_at: string }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [reviews, services, posts, ebooks, downloads, pageViews] = await Promise.all([
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('services').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('ebooks').select('*', { count: 'exact', head: true }),
        supabase.from('ebook_downloads').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      ]);

      setStats({
        pendingReviews: reviews.count || 0,
        activeServices: services.count || 0,
        draftPosts: posts.count || 0,
        totalEbooks: ebooks.count || 0,
        totalDownloads: downloads.count || 0,
        pageViewsWeek: pageViews.count || 0,
      });
    };

    const fetchTopPages = async () => {
      const { data } = await supabase
        .from('page_views')
        .select('page_path');

      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((row) => {
          counts[row.page_path] = (counts[row.page_path] || 0) + 1;
        });
        const sorted = Object.entries(counts)
          .map(([page_path, count]) => ({ page_path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setTopPages(sorted);
      }
    };

    const fetchRecentDownloads = async () => {
      const { data } = await supabase
        .from('ebook_downloads')
        .select('ebook_title, customer_email, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setRecentDownloads(data);
      }
    };

    fetchStats();
    fetchTopPages();
    fetchRecentDownloads();
  }, []);

  const cards = [
    { title: 'Pending Reviews', value: stats.pendingReviews, icon: Star, description: 'Reviews awaiting approval', link: '/admin/reviews' },
    { title: 'Active Services', value: stats.activeServices, icon: Package, description: 'Live service offerings', link: '/admin/services' },
    { title: 'Draft Posts', value: stats.draftPosts, icon: FileText, description: 'Unpublished blog posts', link: '/admin/blog' },
    { title: 'E-Books', value: stats.totalEbooks, icon: BookOpen, description: 'Total e-book library', link: '/admin/ebooks' },
    { title: 'Ebook Downloads', value: stats.totalDownloads, icon: Download, description: 'Total purchases & downloads' },
    { title: 'Page Views (7d)', value: stats.pageViewsWeek, icon: Eye, description: 'Visits in the last 7 days' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the LA121 Consultants admin portal
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => card.link && (window.location.href = card.link)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Visited Pages
              </CardTitle>
              <CardDescription>Most popular pages by view count</CardDescription>
            </CardHeader>
            <CardContent>
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No page view data yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.map((page) => (
                      <TableRow key={page.page_path}>
                        <TableCell className="font-mono text-sm">{page.page_path}</TableCell>
                        <TableCell className="text-right">{page.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Recent Ebook Purchases
              </CardTitle>
              <CardDescription>Latest ebook downloads after payment</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDownloads.length === 0 ? (
                <p className="text-sm text-muted-foreground">No downloads recorded yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ebook</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDownloads.map((dl, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{dl.ebook_title}</TableCell>
                        <TableCell className="text-sm">{dl.customer_email || '—'}</TableCell>
                        <TableCell className="text-right text-sm">
                          {format(new Date(dl.created_at), 'dd MMM yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
