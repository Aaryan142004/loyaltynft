// // "use client";
// // import { useState } from "react";

// // export default function SignupPage() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [wallet, setWallet] = useState("");

// // const handleSignup = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   const res = await fetch("http://localhost:4000/api/auth/signup", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ email, password, wallet }),
// //   });

// //   const data = await res.json();
// //   if (res.ok) {
// //     sessionStorage.setItem("token", data.token);
// //     sessionStorage.setItem("role", data.role);
// //     sessionStorage.setItem("email", data.email);
// //     sessionStorage.setItem("wallet", data.wallet);
// //     window.location.href = "/dashboard";
// //   } else {
// //     alert(data.error || "Signup failed");
// //   }
// // };

// //   return (
// //     <main className="flex items-center justify-center h-screen">
// //       <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
// //         <h1 className="text-xl font-bold mb-4">Signup</h1>
// //         <input type="email" placeholder="Email" className="w-full mb-2 p-2 border rounded"
// //           value={email} onChange={(e) => setEmail(e.target.value)} required />
// //         <input type="password" placeholder="Password" className="w-full mb-2 p-2 border rounded"
// //           value={password} onChange={(e) => setPassword(e.target.value)} required />
// //         <input type="text" placeholder="Wallet Address" className="w-full mb-4 p-2 border rounded"
// //           value={wallet} onChange={(e) => setWallet(e.target.value)} required />
// //         <button className="w-full bg-green-600 text-white py-2 rounded">Signup</button>
// //       </form>
// //     </main>
// //   );
// // }

// "use client";
// import { useState, useEffect } from "react";
// import { requestMint } from "@/utils/api";

// export default function RequestMintPage() {
//   const [status, setStatus] = useState("");
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     setToken(sessionStorage.getItem("token"));
//   }, []);

//   const handleRequest = async () => {
//     if (!token) {
//       alert("You must be logged in to request a mint");
//       return;
//     }

//     try {
//       const res = await requestMint(token);
//       setStatus(res.message || "Mint request submitted");
//     } catch (err) {
//       setStatus("Server error during mint request");
//     }
//   };

//   return (
//     <main className="flex items-center justify-center h-screen">
//       <div className="text-center">
//         <button
//           onClick={handleRequest}
//           className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 transition"
//         >
//           Request NFT Mint
//         </button>
//         {status && <p className="mt-4 text-white">{status}</p>}
//       </div>
//     </main>
//   );
// }


"use client";
import { useState } from "react";
import { signupUser } from "@/app/utils/api";


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signupUser(email, password, wallet);
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("wallet", data.wallet);
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Signup</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Wallet Address"
          className="w-full mb-4 p-2 border rounded"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">Signup</button>
      </form>
    </main>
  );
}
