// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export default function PaymentPage() {
//   const router = useRouter();
//   const [amount, setAmount] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       router.push('/');
//     }
//   }, [router]);

//   const handlePayment = async () => {
//     if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//       setMessage('Please enter a valid amount.');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const token = sessionStorage.getItem('token');

//       const res = await fetch('http://localhost:4000/api/user/create-checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: Number(amount) }),
//       });

//       const data = await res.json();

//       if (res.ok && data.url) {
//         window.location.href = data.url; // Redirect to Stripe
//       } else {
//         setMessage(data.message || 'Something went wrong');
//       }
//     } catch (err) {
//       setMessage('Failed to create Stripe session');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white px-6 py-10">
//       <div className="max-w-xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>

//         <div className="mb-4">
//           <label className="block mb-2 font-medium">Amount (USD)</label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount e.g. 100"
//             className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
//           />
//         </div>

//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition-all"
//         >
//           {loading ? 'Processing...' : 'Pay with Stripe'}
//         </button>

//         {message && <p className="mt-4 text-sm">{message}</p>}
//       </div>
//     </main>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/utils/api';

export default function PaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      router.push('/');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (!token) throw new Error("Missing session token");
      const data = await createCheckoutSession(token, Number(amount));

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Failed to create Stripe session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Amount (USD)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount e.g. 100"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition-all"
        >
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>

        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
      </div>
    </main>
  );
}
