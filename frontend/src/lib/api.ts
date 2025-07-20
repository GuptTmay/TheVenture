const BASE_URL = import.meta.env.VITE_base_url;

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data: { token: string; message: string } = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registeration failed');
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data: { token: string; message: string } = await res.json();
  if (res.status !== 201) throw new Error(data.message || 'Login failed');
  return data;
};
