const API_BASE = '/api/v1';

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function checkServiceStatus() {
  const res = await fetch(`${API_BASE}/health`);
  const data = await res.json();
  return {
    isHealthy: data.data?.status === 'healthy',
    services: data.data?.services || {},
    timestamp: data.data?.timestamp,
  };
}
