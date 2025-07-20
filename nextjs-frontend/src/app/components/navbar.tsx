'use client';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, signupUser } from '../utils/api';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';

interface NavbarProps {
  onDocsClick?: () => void;
  onServicesClick?: () => void;
}

export default function Navbar({ onDocsClick, onServicesClick }: NavbarProps) {
  const router = useRouter();

  // auth / wallet state
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [wallet, setWallet]       = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // modal state
  const [showLoginModal, setShowLoginModal]   = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // sticky + mobile menu
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('wallet');
    if (stored) setWalletAddress(stored);

    const onScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [acct] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(acct);
      setWallet(acct);
      sessionStorage.setItem('wallet', acct);
    } else {
      alert('Please install MetaMask to continue.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('wallet', data.wallet);
        window.location.href = data.role === 'admin' ? '/admin-dashboard' : '/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await signupUser(email, password, wallet);
      if (data.success || data.token) {
        alert('Signup successful!');
        setShowSignupModal(false);
        setShowLoginModal(true);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const navButtons = [
    { label: 'Login',      onClick: () => { setShowLoginModal(true); setMenuOpen(false); } },
    { label: 'Signup',     onClick: () => { setShowSignupModal(true); setMenuOpen(false); } },
    { label: 'Docs',       onClick: () => { onDocsClick?.();  setMenuOpen(false); } },
    { label: 'Services',   onClick: () => { onServicesClick?.(); setMenuOpen(false); } },
    { 
      label: walletAddress
        ? `🔗 ${walletAddress.slice(0,6)}…${walletAddress.slice(-4)}`
        : 'Connect Wallet',
      onClick: () => { connectWallet(); setMenuOpen(false); }
    }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300
        ${isSticky ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'}
      `}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => router.push('/')}
          >
            LoyaltyNFT
          </h1>

          {/* desktop nav */}
          <nav className="hidden md:flex space-x-6 text-sm text-gray-200">
            {navButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="hover:text-white transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </nav>

          {/* mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md">
            <div className="flex flex-col items-center space-y-4 py-4">
              {navButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  className="text-white text-lg hover:underline"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-2xl">
            <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-black border border-gray-700"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded bg-black border border-gray-700"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full mt-4 text-center text-gray-300 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-full max-w-sm p-8 bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-2xl">
            <h2 className="text-xl font-semibold text-center mb-4">Signup</h2>
            <form onSubmit={handleSignup} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-black border border-gray-700"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded bg-black border border-gray-700"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full px-4 py-2 rounded bg-black border border-gray-700"
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                required
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? 'Signing up…' : 'Signup'}
              </button>
            </form>
            <button
              onClick={() => setShowSignupModal(false)}
              className="w-full mt-4 text-center text-gray-300 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
