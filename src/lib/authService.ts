const API_BASE = '/api/v1/auth';

async function handleResponse(res: Response) {
  const text = await res.text();

  if (!res.ok) {
    console.error("Auth API Error:", {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: text
    });
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Request failed (${res.status}): ${text || 'Empty response body'}`);
    }
  }

  if (!text) return { success: true };

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON response:", text);
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

export async function register(data: any) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function login(data: any) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function forgotPassword(data: any) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function resetPassword(data: any) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_BASE}/verify-email?token=${encodeURIComponent(token)}`);
  return handleResponse(res);
}

export async function enable2FA(token: string) {
  const res = await fetch(`${API_BASE}/2fa/enable`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function verify2FA(data: any) {
  const res = await fetch(`${API_BASE}/2fa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function logout(token: string) {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse(res);
}

export async function updateProfile(data: { firstName?: string; lastName?: string; email?: string }, token: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
