// 'use client';
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Optional: Auto-redirect if already logged in
//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     const role = sessionStorage.getItem("role");
//     if (token && role) {
//       router.push(role === "admin" ? "/admin-dashboard" : "/dashboard");
//     }
//   }, []);

// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     const res = await fetch("http://localhost:4000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       sessionStorage.setItem("token", data.token);
//       sessionStorage.setItem("role", data.role);
//       sessionStorage.setItem("email", data.email);
//       sessionStorage.setItem("wallet", data.wallet);
//       router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
//     } else {
//       setError(data.error || "Login failed");
//     }
//   } catch (err) {
//     setError("Server error");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-sm"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center text-white">Login to LoyaltyNFT</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-4 px-4 py-2 border border-gray-700 bg-black/60 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 px-4 py-2 border border-gray-700 bg-black/60 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold transition-all disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </main>
//   );
// }

'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    if (token && role) {
      router.push(role === "admin" ? "/admin-dashboard" : "/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      if (data.token) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("wallet", data.wallet);
        router.push(data.role === "admin" ? "/admin-dashboard" : "/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-md border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Login to LoyaltyNFT</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-700 bg-black/60 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border border-gray-700 bg-black/60 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
