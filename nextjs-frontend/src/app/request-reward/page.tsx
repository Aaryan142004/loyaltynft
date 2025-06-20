'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestRewardPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedEmail = sessionStorage.getItem('email');
    const storedWallet = sessionStorage.getItem('wallet');

    if (!token) {
      router.push('/');
    } else {
      setEmail(storedEmail || '');
      setWallet(storedWallet || '');
    }
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:4000/api/user/request-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email, wallet, amount, reason }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Reward point request submitted successfully! ✅');
        setAmount('');
        setReason('');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Request Reward Points (Based on Payment)</h1>

        <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-lg border border-gray-700">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Payment Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Enter amount paid (₹ or $)"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Reason / Order ID</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="e.g., Paid for 2 items on June 17"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

          {message && <p className="mt-4 text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
