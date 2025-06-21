// Validate that the environment variable is set
if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("❌ NEXT_PUBLIC_BACKEND_URL is not defined. Make sure it's set in Vercel and redeploy the frontend.");
}

// Set the API base from env
const API = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Log the API base to verify in browser console
console.log('🚀 API base:', API);

// User login
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// User signup
export const signupUser = async (email: string, password: string, wallet: string) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, wallet }),
  });
  return res.json();
};

// Request NFT Minting
export const requestMint = async (token: string) => {
  const res = await fetch(`${API}/user/request-mint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Get NFT Status
export const getNFTStatus = async (token: string) => {
  const res = await fetch(`${API}/user/nft-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
