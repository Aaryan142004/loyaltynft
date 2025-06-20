'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function NFTStatus() {
  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/user/nft-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNft(res.data);
    } catch (err) {
      console.error('Failed to fetch NFT status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-md mx-auto bg-zinc-900 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          🪙 NFT Status
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : nft?.hasNFT ? (
          <>
            {nft.image && (
              <img
                src={nft.image}
                alt="NFT"
                className="rounded-xl w-full mb-4"
              />
            )}
            <p className="mb-2">
              <span className="font-semibold">Token ID:</span> {nft.tokenId}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Points:</span> {nft.points}
            </p>
          </>
        ) : (
          <p>No NFT found for this wallet.</p>
        )}

        <button
          onClick={fetchStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full mt-4"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}
