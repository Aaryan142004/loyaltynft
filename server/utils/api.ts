const API = process.env.NEXT_PUBLIC_API || 'http://localhost:4000/api';

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const signupUser = async (email: string, password: string, wallet: string) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, wallet }),
  });
  return res.json();
};

export const requestMint = async (token: string) => {
  const res = await fetch(`${API}/user/request-mint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getNFTStatus = async (token: string) => {
  const res = await fetch(`${API}/user/nft-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
