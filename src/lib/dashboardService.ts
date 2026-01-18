const API_BASE = '/api/v1/dashboard';

export interface DashboardStats {
    totalUsers: number;
    activeSubscriptions: number;
    totalOrganizations: number;
    monthlyRevenue: number;
    revenueChange: number;
    subscriptionChange: number;
    userChange: number;
    orgChange: number;
}

export interface RevenueData {
    month: string;
    revenue: number;
    users: number;
}

export interface SubscriptionData {
    plan: string;
    count: number;
}

export interface ActivityItem {
    id: string;
    type: string;
    message: string;
    user: string;
    time: string;
    status: string;
}

export interface DashboardData {
    stats: DashboardStats;
    revenueData: RevenueData[];
    subscriptionBreakdown: SubscriptionData[];
    recentActivity: ActivityItem[];
}

export async function getDashboardStats(): Promise<DashboardData> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch stats');
    }

    return data.data;
}

export async function getRecentActivity(limit = 10): Promise<ActivityItem[]> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/activity?limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch activity: ${res.status}`);
    }

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch activity');
    }

    return data.data;
}
