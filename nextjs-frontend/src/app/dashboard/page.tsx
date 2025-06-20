// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Navbar from "../components/navbar"; // ✅ Ensure correct path
// import axios from "axios";

// export default function UserDashboard() {
//   const router = useRouter();
//   const params = useSearchParams();

//   const [wallet, setWallet] = useState("");
//   const [email, setEmail] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showCancel, setShowCancel] = useState(false);

//   const [showNFTModal, setShowNFTModal] = useState(false);
//   const [nftData, setNftData] = useState<any>(null);

//   const [showMintModal, setShowMintModal] = useState(false);
//   const [mintMessage, setMintMessage] = useState("");
//   const [mintError, setMintError] = useState("");

//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [payMessage, setPayMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     const storedEmail = sessionStorage.getItem("email");
//     const storedWallet = sessionStorage.getItem("wallet");

//     if (!token) {
//       router.push("/");
//     } else {
//       setEmail(storedEmail || "");
//       setWallet(storedWallet || "");
//     }

//     const status = params.get("status");
//     if (status === "success") {
//       setShowSuccess(true);
//       setTimeout(() => setShowSuccess(false), 5000);
//     } else if (status === "cancel") {
//       setShowCancel(true);
//       setTimeout(() => setShowCancel(false), 5000);
//     }
//   }, [router, params]);

//   const fetchNFTStatus = async () => {
//     try {
//       const token = sessionStorage.getItem("token");
//       const res = await axios.get("http://localhost:4000/api/user/nft-status", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setNftData(res.data);
//     } catch (err) {
//       console.error("Failed to fetch NFT status:", err);
//       setNftData(null);
//     }
//   };

//   const handleFeatureClick = async (feature: string) => {
//     if (feature === "View My NFT") {
//       await fetchNFTStatus();
//       setShowNFTModal(true);
//     } else if (feature === "Mint Loyalty NFT") {
//       setMintMessage("");
//       setMintError("");
//       setShowMintModal(true);
//     } else if (feature === "Make Payment") {
//       setPayMessage("");
//       setShowPaymentModal(true);
//     }
//   };

//   const handleRequestMint = async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setMintError("You must be logged in");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/user/request-mint", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMintMessage("✅ Mint request sent successfully!");
//       } else {
//         setMintError(data.error || "Mint request failed");
//       }
//     } catch (err) {
//       setMintError("Server error");
//     }
//   };

//   const handlePayment = async () => {
//     if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//       setPayMessage("Please enter a valid amount.");
//       return;
//     }

//     setLoading(true);
//     setPayMessage("");

//     try {
//       const token = sessionStorage.getItem("token");

//       const res = await fetch("http://localhost:4000/api/user/create-checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: Number(amount) }),
//       });

//       const data = await res.json();

//       if (res.ok && data.url) {
//         window.location.href = data.url;
//       } else {
//         setPayMessage(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       setPayMessage("Failed to create Stripe session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const features = [
//     { title: "Mint Loyalty NFT", description: "Create a verifiable NFT to start earning points." },
//     { title: "Make Payment", description: "Pay using Stripe and earn loyalty points." },
//     { title: "View My NFT", description: "Check your wallet-linked NFT & point balance." },
//   ];

//   return (
//     <main className="min-h-screen bg-black text-white">
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-6 py-10">
//         <h1 className="text-3xl font-bold mb-6">Welcome to Your Loyalty Dashboard</h1>

//         {showSuccess && (
//           <div className="mb-6 p-4 rounded-lg bg-green-600 text-white font-semibold shadow-lg">
//             ✅ Payment successful! Points request created and will be approved shortly.
//           </div>
//         )}
//         {showCancel && (
//           <div className="mb-6 p-4 rounded-lg bg-red-600 text-white font-semibold shadow-lg">
//             ❌ Payment cancelled. Please try again.
//           </div>
//         )}

//         <div className="bg-gray-800 p-4 rounded-lg mb-8">
//           <p><strong>Wallet:</strong> {wallet || "Not connected"}</p>
//           <p><strong>Email:</strong> {email || "Not available"}</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//           {features.map((feature, idx) => (
//             <div
//               key={idx}
//               className="bg-white/10 border border-gray-700 p-6 rounded-lg hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer"
//               onClick={() => handleFeatureClick(feature.title)}
//             >
//               <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
//               <p className="text-gray-400">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//         {/* NFT Modal */}
//         {showNFTModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//             <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4 text-center">🪙 NFT Status</h2>
//               {nftData?.hasNFT ? (
//                 <div className="text-center">
//                   <p className="mb-2"><strong>Token ID:</strong> {nftData.tokenId}</p>
//                   <p className="mb-2"><strong>Points:</strong> {nftData.points}</p>
//                   {nftData.image && <img src={nftData.image} alt="NFT" className="mx-auto rounded-lg mt-4" />}
//                 </div>
//               ) : (
//                 <p className="text-center">No NFT found for your wallet.</p>
//               )}
//               <button
//                 className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
//                 onClick={() => setShowNFTModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Mint Modal */}
//         {showMintModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//             <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4 text-center">Request Loyalty NFT Mint</h2>
//               <button
//                 onClick={handleRequestMint}
//                 className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold mb-4"
//               >
//                 Request Mint
//               </button>
//               {mintMessage && <p className="text-green-400 text-center">{mintMessage}</p>}
//               {mintError && <p className="text-red-400 text-center">{mintError}</p>}
//               <button
//                 className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
//                 onClick={() => setShowMintModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Payment Modal */}
//         {showPaymentModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//             <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4 text-center">Make a Payment</h2>
//               <label className="block mb-2 font-medium">Amount (USD)</label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount e.g. 100"
//                 className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
//               />
//               <button
//                 onClick={handlePayment}
//                 disabled={loading}
//                 className="bg-indigo-600 w-full py-2 rounded hover:bg-indigo-700 transition-all"
//               >
//                 {loading ? "Processing..." : "Pay with Stripe"}
//               </button>
//               {payMessage && <p className="mt-4 text-sm text-center text-red-400">{payMessage}</p>}
//               <button
//                 className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
//                 onClick={() => setShowPaymentModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import axios from "axios";

export default function UserDashboardClient() {
  const router = useRouter();
  const params = useSearchParams();

  const [wallet, setWallet] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nftData, setNftData] = useState<any>(null);

  const [showMintModal, setShowMintModal] = useState(false);
  const [mintMessage, setMintMessage] = useState("");
  const [mintError, setMintError] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [payMessage, setPayMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedEmail = sessionStorage.getItem("email");
    const storedWallet = sessionStorage.getItem("wallet");

    if (!token) {
      router.push("/");
    } else {
      setEmail(storedEmail || "");
      setWallet(storedWallet || "");
    }

    const status = params.get("status");
    if (status === "success") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (status === "cancel") {
      setShowCancel(true);
      setTimeout(() => setShowCancel(false), 5000);
    }
  }, [router, params]);

  const fetchNFTStatus = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/user/nft-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNftData(res.data);
    } catch (err) {
      console.error("Failed to fetch NFT status:", err);
      setNftData(null);
    }
  };

  const handleFeatureClick = async (feature: string) => {
    if (feature === "View My NFT") {
      await fetchNFTStatus();
      setShowNFTModal(true);
    } else if (feature === "Mint Loyalty NFT") {
      setMintMessage("");
      setMintError("");
      setShowMintModal(true);
    } else if (feature === "Make Payment") {
      setPayMessage("");
      setShowPaymentModal(true);
    }
  };

  const handleRequestMint = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setMintError("You must be logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/user/request-mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setMintMessage("✅ Mint request sent successfully!");
      } else {
        setMintError(data.error || "Mint request failed");
      }
    } catch (err) {
      setMintError("Server error");
    }
  };

  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setPayMessage("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setPayMessage("");

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/user/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setPayMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setPayMessage("Failed to create Stripe session");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { title: "Mint Loyalty NFT", description: "Create a verifiable NFT to start earning points." },
    { title: "Make Payment", description: "Pay using Stripe and earn loyalty points." },
    { title: "View My NFT", description: "Check your wallet-linked NFT & point balance." },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Loyalty Dashboard</h1>

        {showSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-600 text-white font-semibold shadow-lg">
            ✅ Payment successful! Points request created and will be approved shortly.
          </div>
        )}
        {showCancel && (
          <div className="mb-6 p-4 rounded-lg bg-red-600 text-white font-semibold shadow-lg">
            ❌ Payment cancelled. Please try again.
          </div>
        )}

        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <p><strong>Wallet:</strong> {wallet || "Not connected"}</p>
          <p><strong>Email:</strong> {email || "Not available"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-gray-700 p-6 rounded-lg hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleFeatureClick(feature.title)}
            >
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* NFT Modal */}
        {showNFTModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">🪙 NFT Status</h2>
              {nftData?.hasNFT ? (
                <div className="text-center">
                  <p className="mb-2"><strong>Token ID:</strong> {nftData.tokenId}</p>
                  <p className="mb-2"><strong>Points:</strong> {nftData.points}</p>
                  {nftData.image && <img src={nftData.image} alt="NFT" className="mx-auto rounded-lg mt-4" />}
                </div>
              ) : (
                <p className="text-center">No NFT found for your wallet.</p>
              )}
              <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowNFTModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Mint Modal */}
        {showMintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Request Loyalty NFT Mint</h2>
              <button onClick={handleRequestMint}
                className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold mb-4">
                Request Mint
              </button>
              {mintMessage && <p className="text-green-400 text-center">{mintMessage}</p>}
              {mintError && <p className="text-red-400 text-center">{mintError}</p>}
              <button className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowMintModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Make a Payment</h2>
              <label className="block mb-2 font-medium">Amount (USD)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount e.g. 100"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 mb-4" />
              <button onClick={handlePayment} disabled={loading}
                className="bg-indigo-600 w-full py-2 rounded hover:bg-indigo-700 transition-all">
                {loading ? "Processing..." : "Pay with Stripe"}
              </button>
              {payMessage && <p className="mt-4 text-sm text-center text-red-400">{payMessage}</p>}
              <button className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowPaymentModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
