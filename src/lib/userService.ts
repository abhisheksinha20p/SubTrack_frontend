const API_BASE = '/api/v1/users';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getOrganizations() {
  const res = await fetch(`${API_BASE}/organizations`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function createOrganization(data: any) {
  const res = await fetch(`${API_BASE}/organizations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getOrganization(orgId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function updateOrganization(orgId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMembers(orgId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function inviteMember(orgId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMember(orgId: string, memberId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members/${memberId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function removeMember(orgId: string, memberId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members/${memberId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function updateSettings(data: any) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}
