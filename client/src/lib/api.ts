// Use environment variable for API base URL in production
// When deployed on Vercel, VITE_API_URL should be set to https://singhlab2.onrender.com
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  // Use relative path for local dev/unified hosting, absolute for cross-domain
  const targetUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  const response = await fetch(targetUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Team Members
  team: {
    getAll: () => fetchJSON<any[]>('/api/team'),
    getOne: (id: number) => fetchJSON<any>(`/api/team/${id}`),
    create: (data: any) => fetchJSON<any>('/api/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/team/${id}`, {
      method: 'DELETE',
    }),
  },

  // Publications
  publications: {
    getAll: () => fetchJSON<any[]>('/api/publications'),
    getOne: (id: number) => fetchJSON<any>(`/api/publications/${id}`),
    create: (data: any) => fetchJSON<any>('/api/publications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/publications/${id}`, {
      method: 'DELETE',
    }),
  },

  // Gallery Items
  gallery: {
    getAll: () => fetchJSON<any[]>('/api/gallery'),
    getOne: (id: number) => fetchJSON<any>(`/api/gallery/${id}`),
    create: (data: any) => fetchJSON<any>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/gallery/${id}`, {
      method: 'DELETE',
    }),
  },

  // Messages
  messages: {
    getAll: () => fetchJSON<any[]>('/api/messages'),
    getOne: (id: number) => fetchJSON<any>(`/api/messages/${id}`),
    create: (data: any) => fetchJSON<any>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/messages/${id}`, {
      method: 'DELETE',
    }),
  },

  // Research Topics
  research: {
    getAll: () => fetchJSON<any[]>('/api/research'),
    getOne: (id: number) => fetchJSON<any>(`/api/research/${id}`),
    create: (data: any) => fetchJSON<any>('/api/research', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/research/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/research/${id}`, {
      method: 'DELETE',
    }),
  },

  // Projects
  projects: {
    getAll: () => fetchJSON<any[]>('/api/projects'),
    getOne: (id: number) => fetchJSON<any>(`/api/projects/${id}`),
    create: (data: any) => fetchJSON<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => fetchJSON<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchJSON<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),
  },
};
