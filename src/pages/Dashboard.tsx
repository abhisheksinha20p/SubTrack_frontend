import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Building2,
  DollarSign,
  Activity,
  Loader2
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  getDashboardStats,
  DashboardData,
  RevenueData,
  SubscriptionData,
  ActivityItem
} from "@/lib/dashboardService";

// Fallback data for when API fails
const fallbackRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 4000, users: 240 },
  { month: "Feb", revenue: 3000, users: 198 },
  { month: "Mar", revenue: 5000, users: 300 },
  { month: "Apr", revenue: 4500, users: 278 },
  { month: "May", revenue: 6000, users: 389 },
  { month: "Jun", revenue: 5500, users: 349 },
  { month: "Jul", revenue: 7000, users: 430 },
];

const fallbackSubscriptionData: SubscriptionData[] = [
  { plan: "Free", count: 0 },
  { plan: "Pro", count: 0 },
  { plan: "Enterprise", count: 0 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await getDashboardStats();
        setData(dashboardData);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = data?.stats;
  const revenueData = data?.revenueData || fallbackRevenueData;
  const subscriptionData = data?.subscriptionBreakdown || fallbackSubscriptionData;
  const recentActivity = data?.recentActivity || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with SubTrack.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Report</Button>
          <Button variant="gradient">
            <ArrowUpRight className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div variants={itemVariants} className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
              change={{ value: stats?.revenueChange || 0, trend: (stats?.revenueChange || 0) >= 0 ? "up" : "down" }}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="Active Subscriptions"
              value={(stats?.activeSubscriptions || 0).toLocaleString()}
              change={{ value: stats?.subscriptionChange || 0, trend: (stats?.subscriptionChange || 0) >= 0 ? "up" : "down" }}
              icon={<CreditCard className="h-6 w-6" />}
            />
            <StatCard
              title="Total Users"
              value={(stats?.totalUsers || 0).toLocaleString()}
              change={{ value: stats?.userChange || 0, trend: (stats?.userChange || 0) >= 0 ? "up" : "down" }}
              icon={<Users className="h-6 w-6" />}
            />
            <StatCard
              title="Organizations"
              value={(stats?.totalOrganizations || 0).toLocaleString()}
              change={{ value: stats?.orgChange || 0, trend: (stats?.orgChange || 0) >= 0 ? "up" : "down" }}
              icon={<Building2 className="h-6 w-6" />}
            />
          </>
        )}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card variant="glass" className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </div>
              <Badge variant="success">+{stats?.revenueChange || 0}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Breakdown */}
        <Card variant="glass" className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Subscriptions by Plan</CardTitle>
            <CardDescription>Distribution of active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="plan" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest subscription and payment events</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={activity.status as any}>{activity.status}</Badge>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
