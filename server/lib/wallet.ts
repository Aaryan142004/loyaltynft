import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();

  return { web3, account: accounts[0] };
};
