const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "../../.env" }); // ✅ Redundant but harmless here

const web3 = new Web3(process.env.PROVIDER_URL);

// ✅ Load ABI and contract
const abi = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "contract", "abi.json"), "utf8")
);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// ✅ Export a function to load admin account safely
function getAdminAccount() {
  const pk = process.env.ADMIN_PRIVATE_KEY;
  if (!pk) throw new Error("❌ ADMIN_PRIVATE_KEY is not defined in .env");
  const adminAccount = web3.eth.accounts.privateKeyToAccount(pk);
  web3.eth.accounts.wallet.add(adminAccount);
  return adminAccount;
}

module.exports = { web3, contract, getAdminAccount };
