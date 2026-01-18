const API_BASE = '/api/v1/billing';

export async function getPlans() {
  const res = await fetch(`${API_BASE}/plans`, { credentials: 'include' });
  return res.json();
}

export async function getSubscriptions() {
  const res = await fetch(`${API_BASE}/subscriptions`, { credentials: 'include' });
  return res.json();
}

export async function createSubscription(data: any) {
  const res = await fetch(`${API_BASE}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function updateSubscription(id: string, data: any) {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function cancelSubscription(id: string, data: any) {
  const res = await fetch(`${API_BASE}/subscriptions/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}

export async function getInvoices(params = '') {
  const res = await fetch(`${API_BASE}/invoices${params}`, { credentials: 'include' });
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

export async function getUsage() {
  const res = await fetch(`${API_BASE}/usage`, { credentials: 'include' });
  return res.json();
}
