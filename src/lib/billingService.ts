const API_BASE = '/api/v1/billing';

export async function getPlans() {
  const res = await fetch(`${API_BASE}/plans`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function getSubscriptions(organizationId?: string) {
  const token = localStorage.getItem('accessToken');
  const url = organizationId
    ? `${API_BASE}/subscriptions?organizationId=${organizationId}`
    : `${API_BASE}/subscriptions`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function createSubscription(data: any) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSubscription(organizationId: string, newPlanId: string) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/subscriptions/change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ organizationId, newPlanId }),
  });
  return res.json();
}

export async function cancelSubscription(id: string, data: any) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/subscriptions/${id}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getInvoices(organizationId?: string) {
  const token = localStorage.getItem('accessToken');
  const url = organizationId
    ? `${API_BASE}/invoices?organizationId=${organizationId}&limit=5`
    : `${API_BASE}/invoices?limit=5`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getInvoice(id: string) {
  const res = await fetch(`${API_BASE}/invoices/${id}`, { credentials: 'include' });
  return res.json();
}

export async function downloadInvoicePDF(id: string) {
  const res = await fetch(`${API_BASE}/invoices/${id}/pdf`, { credentials: 'include' });
  return res.blob();
}

export async function getPaymentMethods() {
  const res = await fetch(`${API_BASE}/payment-methods`, { credentials: 'include' });
  return res.json();
}

export async function addPaymentMethod(data: any) {
  const res = await fetch(`${API_BASE}/payment-methods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function removePaymentMethod(id: string) {
  const res = await fetch(`${API_BASE}/payment-methods/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function getUsage(organizationId?: string) {
  const token = localStorage.getItem('accessToken');
  const url = organizationId
    ? `${API_BASE}/subscriptions/usage?organizationId=${organizationId}`
    : `${API_BASE}/subscriptions/usage`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function syncSubscription(organizationId: string) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_BASE}/subscriptions/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ organizationId }),
  });
  return res.json();
}
