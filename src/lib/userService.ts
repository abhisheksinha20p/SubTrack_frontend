const API_BASE = '/api/v1/users';

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, { credentials: 'include' });
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function getOrganizations() {
  const res = await fetch(`${API_BASE}/organizations`, { credentials: 'include' });
  return res.json();
}

export async function createOrganization(data: any) {
  const res = await fetch(`${API_BASE}/organizations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function getOrganization(orgId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}`, { credentials: 'include' });
  return res.json();
}

export async function updateOrganization(orgId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function getMembers(orgId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members`, { credentials: 'include' });
  return res.json();
}

export async function inviteMember(orgId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function updateMember(orgId: string, memberId: string, data: any) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members/${memberId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function removeMember(orgId: string, memberId: string) {
  const res = await fetch(`${API_BASE}/organizations/${orgId}/members/${memberId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`, { credentials: 'include' });
  return res.json();
}

export async function updateSettings(data: any) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}
