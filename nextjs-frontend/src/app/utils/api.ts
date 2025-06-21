// ✅ Throw error if backend URL isn't set (helps during deployment)
if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("❌ NEXT_PUBLIC_BACKEND_URL is not defined. Make sure it's set in Vercel and redeploy the frontend.");
}

// ✅ Base URL for all backend API calls
const API = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log('🚀 API base:', API);

// ✅ User login
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ✅ User signup
export const signupUser = async (email: string, password: string, wallet: string) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, wallet }),
  });
  return res.json();
};

// ✅ Request NFT Minting
export const requestMint = async (token: string) => {
  const res = await fetch(`${API}/user/request-mint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ✅ Get NFT Status
export const getNFTStatus = async (token: string) => {
  const res = await fetch(`${API}/user/nft-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ✅ Create Stripe Checkout Session
export const createCheckoutSession = async (token: string, amount: number) => {
  const res = await fetch(`${API}/user/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  return res.json();
};

// ✅ Admin: Get pending requests (mint or payment)
export const getAdminRequests = async (token: string, type: string) => {
  const res = await fetch(`${API}/admin/requests/${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

// ✅ Admin: Approve request (mint or payment)
export const approveRequest = async (token: string, requestId: string) => {
  const res = await fetch(`${API}/admin/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });
  if (!res.ok) throw new Error("Approval failed");
  return res.json();
};
