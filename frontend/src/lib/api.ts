const BASE_URL = import.meta.env.VITE_base_url;

export const registerUser = async (
  name: string,
  password: string
) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, password }),
  });
};

export const loginUser = async (email: string, password: string) => {
  return await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const sendOtp = async (email: string) => {
  return await fetch(`${BASE_URL}/auth/sendotp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email }),
  });
};

export const verifyOtp = async (email: string, otp: string) => {
  return await fetch(`${BASE_URL}/auth/verifyotp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, otp: otp }),
  });
};

export const changePassword = async (password: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/auth/changepassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: password }),
  });
};
