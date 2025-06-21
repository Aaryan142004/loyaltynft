// 'use client';
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RequestMintPage() {
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleRequestMint = async () => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       setError("You must be logged in");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:4000/api/user/request-mint", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: 0 }), // or no body if not needed
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Mint request sent successfully!");
//       } else {
//         setError(data.error || "Mint request failed");
//       }
//     } catch (err) {
//       setError("Server error");
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
//       <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-gray-700 p-6 rounded-xl">
//         <h1 className="text-2xl font-bold mb-4 text-center">Request Loyalty NFT Mint</h1>
//         <button
//           onClick={handleRequestMint}
//           className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold mb-4"
//         >
//           Request Mint
//         </button>
//         {message && <p className="text-green-400 text-center">{message}</p>}
//         {error && <p className="text-red-400 text-center">{error}</p>}
//       </div>
//     </main>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { requestMint } from '../utils/api';


export default function RequestMintPage() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, []);

  const handleRequest = async () => {
    if (!token) {
      alert("You must be logged in to request a mint");
      return;
    }

    try {
      const res = await requestMint(token);
      setStatus(res.message || "Mint request submitted");
    } catch (err) {
      setStatus("Server error during mint request");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <button
          onClick={handleRequest}
          className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 transition"
        >
          Request NFT Mint
        </button>
        {status && <p className="mt-4 text-white">{status}</p>}
      </div>
    </main>
  );
}
