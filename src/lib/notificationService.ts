const API_BASE = '/api/v1/notifications';

export async function getNotifications(params = '') {
  const res = await fetch(`${API_BASE}${params}`, { credentials: 'include' });
  return res.json();
}

export async function markAsRead(notificationId: string) {
  const res = await fetch(`${API_BASE}/${notificationId}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });
  return res.json();
}

export async function markAllAsRead() {
  const res = await fetch(`${API_BASE}/mark-all-read`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}

export async function getPreferences() {
  const res = await fetch(`${API_BASE}/preferences`, { credentials: 'include' });
  return res.json();
}

export async function updatePreferences(data: any) {
  const res = await fetch(`${API_BASE}/preferences`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function getWebhooks() {
  const res = await fetch(`${API_BASE}/webhooks`, { credentials: 'include' });
  return res.json();
}

export async function createWebhook(data: any) {
  const res = await fetch(`${API_BASE}/webhooks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function deleteWebhook(webhookId: string) {
  const res = await fetch(`${API_BASE}/webhooks/${webhookId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}
