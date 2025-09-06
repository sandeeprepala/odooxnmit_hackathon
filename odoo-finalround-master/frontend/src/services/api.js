const BASE_URL = import.meta.env.MODE === 'development'
? 'http://localhost:5000/api'
: 'https://odoo-finalround.onrender.com/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw await errorFromResponse(res);
  return res.json();
}

async function errorFromResponse(res) {
  try {
    const data = await res.json();
    return Object.assign(new Error(data.message || 'Request failed'), { response: { data } });
  } catch (e) {
    return new Error(res.statusText || 'Request failed');
  }
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: 'POST', body, token }),
  put: (path, body, token) => request(path, { method: 'PUT', body, token }),
  del: (path, token) => request(path, { method: 'DELETE', token })
};


