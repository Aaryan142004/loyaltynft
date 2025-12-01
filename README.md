
# 🪙 Loyalty NFT Framework

A full-stack blockchain-based loyalty platform that rewards users with ERC-721 NFTs and on-chain loyalty points through Stripe payments and admin-approved actions.
Designed for seamless integration into e-commerce and customer engagement systems, the platform leverages **Polygon zkEVM**, secure backend logic, and efficient UI flows to deliver a reliable, transparent reward experience.

---

# 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [System Workflow](#system-workflow)
6. [Smart Contract Design](#smart-contract-design)
7. [Backend API Overview](#backend-api-overview)
8. [Admin Dashboard Features](#admin-dashboard-features)
9. [Deployment](#deployment)
10. [Challenges & Solutions](#challenges--how-i-solved-them)
11. [Future Enhancements](#future-enhancements)

---

# 🔍 Overview

The Loyalty NFT Framework assigns every user a unique NFT representing their identity. Loyalty points are stored on-chain and updated after verified Stripe payments or admin-approved actions.
The platform ensures transparency, tamper-proof point tracking, and smooth integration with existing payment workflows.

---

# 🏗️ Architecture

```
                ┌────────────────────────┐
                │        Frontend        │
                │ Next.js + Tailwind     │
                └──────────┬─────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │        Backend         │
                │ Express.js + MongoDB   │
                │ JWT Auth, Stripe API   │
                └──────────┬─────────────┘
                           │
                           ▼
         ┌────────────────────────────────────────┐
         │            Blockchain Layer            │
         │ Solidity Smart Contract (ERC-721)      │
         │ Polygon zkEVM + Web3.js                │
         └────────────────────────────────────────┘
```

---

# 🔧 Tech Stack

### **Frontend**

* Next.js
* Tailwind CSS
* TypeScript

### **Backend**

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

### **Blockchain**

* Solidity
* Hardhat
* Web3.js
* Polygon zkEVM

### **Payments**

* Stripe Checkout
* Stripe Webhooks

### **Deployment**

* Vercel (Frontend)
* Render (Backend)

---

# ⭐ Features

### 🔐 **1. NFT-Based Loyalty Program**

* Each user receives a unique **ERC-721** NFT.
* Loyalty points stored directly in the smart contract.
* Points updated only after verified actions (e.g., payments).

### 💳 **2. Stripe Payment Integration**

* Users make payments through Stripe Checkout.
* On successful payment webhook, admin approves the request.
* NFT points are updated automatically.

### 🧑‍💼 **3. Admin Approval System**

Prevents fraudulent minting or reward triggers:

* Approve mint requests
* Approve payment reward allocation
* Monitor all user transactions

### 📊 **4. User Dashboard**

* Connect Wallet
* Request NFT mint
* Make payments via Stripe
* Check loyalty point balance
* View NFT status + metadata

### 📈 **5. Tested Reliability**

* 20+ simulated flows
* ₹5K+ mock transactions
* Verified wallet–token mapping consistency

---

# 🔁 System Workflow

## **1. User Signup & Login**

* User registers via email/password.
* JWT token issued.
* User connects MetaMask wallet.

## **2. NFT Mint Flow**

```
User → Request Mint → Backend → Admin Approval → Smart Contract Mint → User NFT Issued
```

## **3. Payment → Points Flow**

```
User Payment → Stripe Checkout → Stripe Webhook → Backend Request → Admin Approval → Smart Contract Points Update → User Dashboard Refresh
```

---

# 🧠 Smart Contract Design

### Contract: **LoyaltyNFT.sol**

#### Key Functions:

* `mintNFT(address user)`
* `addPointsToNFT(uint256 tokenId, uint256 points)`
* `getPoints(uint256 tokenId)`
* `walletToToken(address wallet)` mapping
* `tokenURI(uint256 tokenId)` for metadata

#### Security Mechanisms:

* Only admin can mint NFTs
* Only admin can update points
* Prevents duplicate wallet-to-token mappings

---

# 🛠 Backend API Overview

### **Auth Routes**

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| POST   | `/signup` | Register user          |
| POST   | `/login`  | Login user & issue JWT |

### **User Routes**

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/request-mint`            | User requests NFT mint   |
| POST   | `/create-checkout-session` | Initiates Stripe payment |
| GET    | `/nft-status`              | Fetch user NFT + points  |

### **Admin Routes**

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/pending-requests` | List all pending actions |
| POST   | `/approve/:id`      | Approve mint/payment     |
| POST   | `/reject/:id`       | Reject request           |

---

# 🧑‍💼 Admin Dashboard Features

* View all pending mint/payment requests
* Approve with one click
* Automatically triggers:

  * Smart contract mint
  * Points update
  * Wallet–token mapping consistency check

---

# ☁ Deployment

### **Frontend**

* Hosted on **Vercel**
* URL: [https://loyaltynft.vercel.app](https://loyaltynft.vercel.app)

### **Backend**

* Hosted on **Render**
* URL: [https://loyaltynft.onrender.com/api](https://loyaltynft.onrender.com/api)

---

# 🛠️ Challenges & How I Solved Them

**One of the biggest challenges was stabilizing the NFT minting + Stripe payment pipeline on Polygon zkEVM.**

### ❌ Problems Faced

* Nonce collisions due to multiple parallel transactions
* Delayed on-chain confirmations leading to inconsistent NFT state
* Wallet–token mapping mismatches
* Failed mint or reward transactions under load

### ✔ Solutions Implemented

* Introduced **transaction queueing** to ensure sequential execution
* Added **event-based retry logic** for failed on-chain txns
* Implemented **strict wallet–token consistency validation** before minting
* Simulated **20+ Stripe payment flows** to test concurrency and load
* Added logging + monitoring to catch edge cases

### 🎯 Result

* Eliminated inconsistent mint states
* Improved reliability and production readiness
* Smooth coordinated flow of Stripe → Backend → Blockchain



