"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("mint");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
    } else {
      fetchRequests(token, type);
    }
  }, [type]);

  const fetchRequests = async (token: string, type: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/requests/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Admin session expired. Please login again.");

    try {
      const res = await fetch("http://localhost:4000/api/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Request approved");
        fetchRequests(token, type);
      } else {
        alert(data.error || "Approval failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-gray-800 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">🔐 Admin Dashboard</h1>

        <div className="flex justify-center mb-6">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="text-black p-2 rounded"
          >
            <option value="mint">Mint</option>
            <option value="payment">Payment</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400">No pending requests</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((r: any) => (
              <li
                key={r._id}
                className="p-4 bg-black/60 border border-gray-700 rounded-lg shadow-md"
              >
                <p><strong>Email:</strong> {r.user?.email || r.email}</p>
                <p><strong>Wallet:</strong> {r.user?.wallet || r.wallet}</p>
                {r.amount && <p><strong>Amount:</strong> ${r.amount}</p>}
                <button
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
                  onClick={() => handleApprove(r._id)}
                >
                  ✅ Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
