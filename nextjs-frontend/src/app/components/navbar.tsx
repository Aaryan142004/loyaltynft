'use client';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser } from '../utils/api'; // ✅ Import API functions

interface NavbarProps {
  onDocsClick?: () => void;
  onServicesClick?: () => void;
}

export default function Navbar({ onDocsClick, onServicesClick }: NavbarProps) {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const storedWallet = sessionStorage.getItem("wallet");
    if (storedWallet) setWalletAddress(storedWallet);

    const handleScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      setWallet(accounts[0]);
    } else {
      alert("Please install MetaMask to continue.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password); // ✅ Use centralized API call
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("wallet", data.wallet);
        window.location.href = data.role === "admin" ? "/admin-dashboard" : "/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await signupUser(email, password, wallet); // ✅ Use centralized API call
      if (data.success || data.token) {
        alert("Signup successful!");
        setShowSignupModal(false);
        setShowLoginModal(true);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isSticky ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => router.push('/')}>
            LoyaltyNFT
          </h1>
          <nav className="space-x-6 text-sm text-gray-200">
            <button onClick={() => setShowLoginModal(true)} className="hover:text-white">Login</button>
            <button onClick={() => setShowSignupModal(true)} className="hover:text-white">Signup</button>
            <button onClick={onDocsClick} className="hover:text-white">Docs</button>
            <button onClick={onServicesClick} className="hover:text-white">Services</button>
            <button onClick={connectWallet} className="hover:text-white">
              {walletAddress ? `🔗 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </button>
          </nav>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white/10 text-white border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700" required />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-gray-300 hover:text-white text-sm w-full text-center">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white/10 text-white border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm backdrop-blur">
            <h2 className="text-xl font-semibold mb-4 text-center">Signup</h2>
            <form onSubmit={handleSignup}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700" required />
              <input type="text" placeholder="Wallet Address" value={wallet} onChange={(e) => setWallet(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700" required />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <button type="submit" className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold">
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
            <button onClick={() => setShowSignupModal(false)} className="mt-4 text-gray-300 hover:text-white text-sm w-full text-center">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
