// 'use client';
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import Navbar from "./components/navbar";

// export default function HomePage() {
//   const [walletAddress, setWalletAddress] = useState("");
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showSignupModal, setShowSignupModal] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [wallet, setWallet] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const docsRef = useRef<null | HTMLDivElement>(null);
//   const servicesRef = useRef<null | HTMLDivElement>(null);

//   useEffect(() => {
//     document.body.classList.add("bg-black");
//   }, []);

//   const connectWallet = async () => {
//     if (typeof window.ethereum !== "undefined") {
//       try {
//         const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//         setWalletAddress(accounts[0]);
//         setWallet(accounts[0]);
//       } catch (err) {
//         console.error("Wallet connection failed:", err);
//       }
//     } else {
//       alert("Please install MetaMask to continue.");
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:4000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         sessionStorage.setItem("token", data.token);
//         sessionStorage.setItem("role", data.role);
//         sessionStorage.setItem("email", data.email);
//         sessionStorage.setItem("wallet", data.wallet);
//         window.location.href = data.role === "admin" ? "/admin-dashboard" : "/dashboard";
//       } else {
//         setError(data.error || "Login failed");
//       }
//     } catch {
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("http://localhost:4000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, wallet }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Signup successful!");
//         setShowSignupModal(false);
//         setShowLoginModal(true);
//       } else {
//         setError(data.error || "Signup failed");
//       }
//     } catch {
//       setError("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollToDocs = () => docsRef.current?.scrollIntoView({ behavior: "smooth" });
//   const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });

//   return (
//     <main className="min-h-screen w-full text-white bg-black px-4 md:px-10 py-6">
//       <Navbar
//         onDocsClick={scrollToDocs}
//         onServicesClick={scrollToServices}
//       />

//       <section className="text-center mt-12 max-w-3xl mx-auto">
//         <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
//           NFT Loyalty. Done Right.
//         </h2>
//         <p className="text-gray-400 text-lg mb-6">
//           Reward customers with NFT points powered by Polygon zkEVM.
//         </p>
//         <button className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3 rounded-full"
//           onClick={connectWallet}>
//           {walletAddress ? `🔗 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
//         </button>
//       </section>

//       <section className="mt-16 max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
//         <div className="relative w-full md:w-1/2">
//           <Image src="/backgroundphoto.jpg" alt="Hero" width={800} height={500} className="rounded-3xl shadow-2xl" />
//         </div>
//         <div className="space-y-6 w-full md:w-1/2">
//           {[{ label: "Mint NFTs", path: "/dashboard" },
//             { label: "Make payments", path: "/dashboard" },
//             { label: "Admin panel", path: "/admin-dashboard" }
//           ].map((f, i) => (
//             <div key={i} onClick={() => window.location.href = f.path}
//               className="bg-gray-900 border p-4 rounded-xl hover:border-blue-500 cursor-pointer">
//               <p className="text-lg font-medium">{f.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Workflow Section */}
//       <section ref={docsRef} id="docs" className="mt-24 max-w-6xl mx-auto px-4">
//         <h3 className="text-3xl font-bold text-center mb-12">🔁 LoyaltyNFT Workflow</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {[
//             { front: { emoji: "🦊", title: "Connect Wallet" }, back: "Install MetaMask and link wallet to begin." },
//             { front: { emoji: "🔐", title: "Signup/Login" }, back: "Register or log in with email and wallet." },
//             { front: { emoji: "🪙", title: "Mint NFT" }, back: "Request a loyalty NFT. Admin approves it." },
//             { front: { emoji: "📊", title: "Track Points" }, back: "View points, NFTs, and rewards anytime." },
//           ].map((card, i) => (
//             <div key={i} className="perspective w-full h-64">
//               <div className="card-flip w-full h-full rounded-2xl shadow-lg group-hover:shadow-2xl">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900 text-white rounded-xl p-6 flex flex-col justify-center items-center backface-hidden">
//                   <div className="text-4xl mb-2">{card.front.emoji}</div>
//                   <h4 className="text-lg font-semibold tracking-wide">{card.front.title}</h4>
//                 </div>
//                 <div className="card-face card-back bg-gradient-to-tr from-indigo-900 to-purple-800 text-white text-center">
//                   <p className="text-sm px-2 leading-relaxed">{card.back}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Services Section */}
//       <section ref={servicesRef} className="mt-24 max-w-6xl mx-auto px-4">
//         <h3 className="text-3xl font-bold text-center mb-12 text-white">🛠️ Services Offered</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[
//             { icon: "🛡️", title: "Secure NFT Ownership", desc: "On-chain verification ensuring authenticity and wallet-tied NFTs." },
//             { icon: "⚡", title: "Low Transaction Fees", desc: "Minimal gas fees via Polygon zkEVM scalability." },
//             { icon: "💳", title: "Stripe Payments", desc: "Pay via Stripe and earn loyalty points instantly." },
//             { icon: "📈", title: "Live Point Tracking", desc: "Real-time loyalty point updates synced from smart contracts." },
//             { icon: "🧩", title: "Modular Components", desc: "Extend system with NFT tiers, governance modules and more." },
//             { icon: "🌐", title: "Admin Dashboard", desc: "Admin control for minting/payment approvals." },
//           ].map((service, idx) => (
//             <div key={idx} className="bg-gray-900 rounded-xl p-6 border border-white/10 hover:border-purple-500 shadow-md transition-all duration-300 text-white">
//               <div className="text-4xl mb-4">{service.icon}</div>
//               <h4 className="text-lg font-bold mb-2">{service.title}</h4>
//               <p className="text-sm text-gray-300">{service.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="mt-20 max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl shadow-xl text-center space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           <div className="hover:scale-105"><p className="text-3xl font-bold text-yellow-400">10k+</p><p className="text-gray-400">Points Awarded</p></div>
//           <div className="hover:scale-105"><p className="text-3xl font-bold text-indigo-400">1k+</p><p className="text-gray-400">NFTs Minted</p></div>
//           <div className="hover:scale-105"><p className="text-3xl font-bold text-green-400">500+</p><p className="text-gray-400">Active Users</p></div>
//         </div>
//         <p className="text-white text-xl mt-6 animate-pulse">Join the ecosystem today. 🚀</p>
//       </section>

//       {/* Signup Modal */}
//       {showSignupModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="backdrop-blur-lg bg-white/10 text-white border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
//             <h2 className="text-xl font-semibold mb-4 text-center">Signup for LoyaltyNFT</h2>
//             <form onSubmit={handleSignup}>
//               <input 
//                 type="email" 
//                 placeholder="Email" 
//                 className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 required 
//               />
//               <input 
//                 type="password" 
//                 placeholder="Password" 
//                 className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required 
//               />
//               <input 
//                 type="text" 
//                 placeholder="Wallet Address" 
//                 className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
//                 value={wallet} 
//                 onChange={(e) => setWallet(e.target.value)} 
//                 required 
//               />
//               {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
//               <button 
//                 type="submit" 
//                 className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold transition-colors"
//                 disabled={loading}
//               >
//                 {loading ? "Signing up..." : "Signup"}
//               </button>
//             </form>
//             <button 
//               onClick={() => setShowSignupModal(false)}
//               className="mt-4 text-gray-300 hover:text-white text-sm w-full text-center transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
'use client';

import Image from "next/image";
import { Inter } from 'next/font/google';
import { useEffect, useRef, useState, Suspense } from "react";
import { ShieldCheck, Zap, Puzzle } from "lucide-react";
import Navbar from "./components/navbar";

const inter = Inter({ subsets: ['latin'] });

function DashboardPageContent() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const docsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("bg-black");
  }, []);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const [acct] = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(acct);
        setWallet(acct);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const scrollToDocs = () => docsRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToServices = () => servicesRef.current?.scrollIntoView({ behavior: "smooth" });

  const workflowCards = [
    { emoji: "🦊", title: "Connect Wallet", desc: "Install MetaMask and link your wallet to begin." },
    { emoji: "🔐", title: "Signup/Login",   desc: "Register or log in with your email & wallet." },
    { emoji: "🪙", title: "Mint NFT",       desc: "Request a loyalty NFT—admin will approve it." },
    { emoji: "🏆", title: "Track Points",   desc: "View your NFT points & rewards anytime." },
  ];

  const services = [
    { icon: "🛡️", title: "Secure NFT Ownership",    desc: "Benefit from on-chain verification ensuring authenticity." },
    { icon: "⚡",   title: "Low Transaction Fees",    desc: "Minimal gas via Polygon zkEVM scalability." },
    { icon: "💳",   title: "Stripe Payments",         desc: "Pay via Stripe and earn loyalty points instantly." },
    { icon: "📈",   title: "Live Point Tracking",     desc: "Real-time loyalty point updates from smart contracts." },
    { icon: "🧩",   title: "Modular Components",      desc: "Extend with NFT tiers, governance modules & more." },
    { icon: "🌐",   title: "Admin Dashboard",         desc: "Full control over minting & payment approvals." },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, wallet }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        setShowSignupModal(false);
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
    <main className={`${inter.className} min-h-screen w-full text-white px-4 md:px-10 py-6`}>
      <Navbar onDocsClick={scrollToDocs} onServicesClick={scrollToServices} />

      {/* Hero */}
      <section className="text-center mt-12 max-w-3xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="gradient-text">NFT Loyalty.</span>{" "}
          <span className="text-white">Done Right.</span>
        </h2>
        <p className="text-gray-400 text-lg mb-6">
          Reward customers with NFT points powered by Polygon zkEVM.
        </p>
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 rounded-full transition"
        >
          {walletAddress
            ? `🔗 ${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </section>

      {/* Quick Links */}
      <section className="mt-16 max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="relative w-full md:w-1/2">
          <Image
            src="/backgroundphoto.jpg"
            alt="Hero"
            width={800}
            height={500}
            className="rounded-3xl shadow-2xl"
          />
        </div>
        <div className="space-y-6 w-full md:w-1/2">
          {[
            { label: "Mint NFTs" },
            { label: "Make Payments" },
            { label: "Admin Panel"},
          ].map((f, i) => (
            <div
              key={i}
             // onClick={() => (window.location.href = f.path)}
              className="bg-gray-900 border border-gray-700 p-4 rounded-xl hover:border-purple-600 transition"
            >
              <p className="text-lg font-medium">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Services for Everyone */}
<section ref={servicesRef} className="mt-24 max-w-6xl mx-auto px-4">
  <div className="text-center mb-12">
    <h3 className="text-5xl md:text-6xl font-extrabold">
      LoyaltyNFT <span className="text-gray-400">Services for</span>{" "}
      <span className="gradient-text">Everyone</span>
    </h3>
    <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
      Experience faster, cheaper, and more scalable loyalty rewards with
      NFT-powered points on Polygon zkEVM.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {services.map((s, idx) => (
      <div key={idx} className="flex justify-center">
        <div
          className="
            bg-gradient-to-br from-indigo-900 to-purple-800
            rounded-3xl p-8 w-full max-w-sm
            border-2 border-transparent
            hover:border-purple-500
            hover:scale-105
            transition-transform transition-colors duration-200
            flex flex-col items-center text-white
          "
        >
          <div className="w-12 h-12 mb-4">
            { /* if you’ve installed lucide-react you can replace this: */ }
            <span className="text-3xl">{s.icon}</span>
          </div>
          <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
          <p className="text-sm text-center text-gray-200">{s.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>
{/* Workflow */}
<section ref={docsRef} className="mt-24 max-w-6xl mx-auto px-4">
  <h3 className="text-center mb-12 text-5xl md:text-6xl font-extrabold">
    <span className="gradient-text">LoyaltyNFT</span>{" "}
    <span className="text-white">Workflow</span>
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {workflowCards.map((c, i) => (
      <div
        key={i}
        className="perspective w-full h-64"
        onClick={() => setActiveCard(activeCard === i ? null : i)}
      >
        <div
          className={`
            card-flip relative w-full h-full 
            rounded-2xl shadow-md
            transition-transform duration-300 ease-in-out
            ${activeCard === i ? "flipped" : ""}
          `}
        >
          {/* front */}
          <div className="
            card-front absolute inset-0 
            bg-gradient-to-br from-purple-600 to-indigo-600
            border-2 border-transparent rounded-2xl
            flex flex-col items-center justify-center 
            text-white p-6
            hover:border-purple-500 hover:shadow-xl
          ">
            <div className="text-5xl mb-3">{c.emoji}</div>
            <h4 className="text-xl md:text-2xl font-semibold">{c.title}</h4>
          </div>
          {/* back */}
          <div className="
            card-back absolute inset-0 
            bg-gradient-to-tr from-indigo-600 to-purple-700
            border-2 border-transparent rounded-2xl
            flex flex-col items-center justify-center 
            text-white p-6 text-center
            hover:border-purple-500 hover:shadow-xl
          ">
            <p className="text-base md:text-lg leading-relaxed">{c.desc}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Why LoyaltyNFT? */}
      <section className="mt-20 max-w-5xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-xl text-center">
        <h3 className="text-5xl font-extrabold mb-8">
          <span className="text-white">Why Choose </span>
          <span className="gradient-text">Loyalty</span>
          <span className="text-cyan-400">NFT?</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck size={32} />,
              title: "Ethereum-grade Security",
              desc: "Every loyalty NFT settles on Polygon zkEVM for iron-clad on-chain finality.",
            },
            {
              icon: <Zap size={32} />,
              title: "Instant Finality",
              desc: "Minting and point updates happen in seconds—no more waiting around.",
            },
            {
              icon: <Puzzle size={32} />,
              title: "Modular Architecture",
              desc: "Drop-in components for wallets, Stripe, governance, tiers & more.",
            },
          ].map((h, i) => (
            <div
              key={i}
              className={`
                relative p-6 rounded-2xl bg-gradient-to-br
                ${i === 0 ? "from-purple-600 to-indigo-600" : ""}
                ${i === 1 ? "from-indigo-700 to-purple-700" : ""}
                ${i === 2 ? "from-cyan-500 to-blue-500" : ""}
                border-2 border-transparent
                hover:border-purple-500
                hover:-rotate-1
                transition-transform transition-colors duration-200
                flex flex-col items-center text-white
              `}
            >
              <div className="mb-4">{h.icon}</div>
              <h4 className="text-2xl font-semibold mb-2">{h.title}</h4>
              <p className="text-gray-200">{h.desc}</p>
              <span className="absolute top-4 right-4 text-4xl opacity-20">{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-lg text-gray-400">
          Ready to see it live? Connect your wallet and take it for a spin! 🚀
        </p>
      </section>
 {/* Stats */}
      <section className="mt-20 max-w-5xl mx-auto bg-gray-900 p-10 rounded-2xl shadow-xl text-center space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-cyan-400">100+</p>
            <p className="text-gray-400">Points Awarded</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-cyan-400">200+</p>
            <p className="text-gray-400">NFTs Minted</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-cyan-400">50+</p>
            <p className="text-gray-400">Active Users</p>
          </div>
        </div>
        <p className="text-gray-400 text-xl mt-6">
          Ready to dive in? Connect your wallet and experience it yourself! 🚀
        </p>
      </section>
      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="backdrop-blur-lg bg-white/10 text-white border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">Signup for LoyaltyNFT</h2>
            <form onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full mb-3 px-4 py-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                required
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 w-full py-2 rounded font-semibold transition-colors"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
            <button
              onClick={() => setShowSignupModal(false)}
              className="mt-4 text-gray-300 hover:text-white w-full text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading…</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
