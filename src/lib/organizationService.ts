const API_BASE = '/api/v1/users/organizations';

export interface Organization {
    _id: string;
    name: string;
    slug: string;
    role?: string; // Role of the current user in this org
    ownerId?: string;
}

export interface Member {
    _id: string;
    userId: string;
    organizationId: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    status: 'pending' | 'active' | 'inactive';
    firstName?: string;
    lastName?: string;
    invitedAt?: string;
    joinedAt?: string;
}

export async function getUserOrganizations(): Promise<Organization[]> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(API_BASE, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch organizations: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
}

export async function createOrganization(name: string): Promise<Organization> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to create organization');
    }

    const data = await res.json();
    return data.data;
}

export async function getOrganizationMembers(orgId: string): Promise<Member[]> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}/members`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch members: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
}

export async function inviteMember(orgId: string, email: string, role: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}/members`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to invite member');
    }
}

export async function updateMemberRole(orgId: string, memberId: string, role: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to update member role');
    }
}

export async function removeMember(orgId: string, memberId: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to remove member');
    }
}

export async function updateOrganization(orgId: string, updates: Partial<Organization>): Promise<Organization> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to update organization');
    }

    const data = await res.json();
    return data.data;
}

export async function deleteOrganization(orgId: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/${orgId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Failed to delete organization');
    }
}
