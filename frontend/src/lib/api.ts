const BASE_URL = import.meta.env.VITE_base_url;

export const registerUser = async (name: string, password: string) => {
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

export const getAllBlogs = async () => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getBlog = async (id: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserBlogs = async () => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/user/blogs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createBlog = async (title: string, content: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: title, content: content }),
  });
};

export const editBlog = async (id: string, title: string, content: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: title, content: content }),
  });
};

export const deleteBlog = async (id: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAiBlog = async ({ topic }: { topic: string }) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ topic: topic }),
  });
};

export const getBlogVotes = async (blogId: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${blogId}/votes`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const checkIfVoted = async (blogId: string) => {
  const token = sessionStorage.getItem('token');
  return await fetch(`${BASE_URL}/feeds/vote/${blogId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addBlogVote = async (blogId: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ blogId: blogId }),
  });
};

export const removeBlogVote = async (blogId: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/vote`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ blogId: blogId }),
  });
};

export const getBlogComments = async (blogId: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${blogId}/comments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createBlogComment = async (blogId: string, content: string) => {
  const token = sessionStorage.getItem('token');

  return await fetch(`${BASE_URL}/feeds/blog/${blogId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: content }),
  });
};
