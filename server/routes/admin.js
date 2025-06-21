const express = require('express');
const jwt = require('jsonwebtoken');
const Request = require('../models/Request');
const User = require('../models/User');
const { contract, web3, getAdminAccount } = require('../utils/web3');
require('dotenv').config({ path: '../../.env' });

const router = express.Router();

// Middleware to auth admin
const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    if (role !== 'admin') throw Error();
    req.adminId = id;
    next();
  } catch {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// Fetch pending requests
router.get('/requests/:type', authAdmin, async (req, res) => {
  const { type } = req.params;
  const list = await Request.find({ type, status: 'pending' }).populate('user', 'email wallet');
  res.json(list);
});

// Approve
router.post('/approve', authAdmin, async (req, res) => {
  const adminAccount = getAdminAccount(); // ✅ lazy load after env

  try {
    const { requestId } = req.body;
    const reqDoc = await Request.findById(requestId).populate('user');

    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    if (reqDoc.type === 'mint') {
      console.log('Processing mint request for user:', reqDoc.user.email);
      const tx = contract.methods.mintNFT(reqDoc.user.wallet);
      const gas = await tx.estimateGas({ from: adminAccount.address });
      const gasPrice = await web3.eth.getGasPrice();
      const data = tx.encodeABI();

      const signedMint = await web3.eth.accounts.signTransaction({
        from: adminAccount.address,
        to: contract.options.address,
        data,
        gas: Math.round(Number(gas) * 1.2),
        gasPrice: gasPrice.toString()
      }, adminAccount.privateKey);

      const mintReceipt = await web3.eth.sendSignedTransaction(signedMint.rawTransaction);
      console.log('Minted NFT tx:', mintReceipt.transactionHash);

    } else if (reqDoc.type === 'payment') {
      console.log('Processing payment request for user:', reqDoc.user.email);
      try {
        let tokenId = await contract.methods.walletToToken(reqDoc.user.wallet).call();

        if (!tokenId || Number(tokenId) === 0) {
          console.log('Mapping not found, scanning tokens...');
          const maxTokenId = await contract.methods.tokenCounter().call();
          let userTokenId = null;

          for (let i = Number(maxTokenId) - 1; i > 0; i--) {
            try {
              const owner = await contract.methods.ownerOf(i).call();
              if (owner.toLowerCase() === reqDoc.user.wallet.toLowerCase()) {
                userTokenId = i;
                break;
              }
            } catch {}
          }

          if (!userTokenId) {
            return res.status(404).json({ error: 'Token not found for user' });
          }

          console.log('Fixing token mapping...');
          const fixTx = contract.methods.fixWalletToTokenMapping(reqDoc.user.wallet, userTokenId);
          const fixGas = await fixTx.estimateGas({ from: adminAccount.address });
          const fixData = fixTx.encodeABI();
          const fixGasPrice = await web3.eth.getGasPrice();

          const signedFix = await web3.eth.accounts.signTransaction({
            from: adminAccount.address,
            to: contract.options.address,
            data: fixData,
            gas: Math.round(Number(fixGas) * 1.2),
            gasPrice: fixGasPrice.toString()
          }, adminAccount.privateKey);

          await web3.eth.sendSignedTransaction(signedFix.rawTransaction);
          tokenId = userTokenId;
        }

        const pointsTx = contract.methods.addPointsToNFT(Number(tokenId), reqDoc.amount);
        const pointsGas = await pointsTx.estimateGas({ from: adminAccount.address });
        const pointsData = pointsTx.encodeABI();
        const pointsGasPrice = await web3.eth.getGasPrice();

        const signedPoints = await web3.eth.accounts.signTransaction({
          from: adminAccount.address,
          to: contract.options.address,
          data: pointsData,
          gas: Math.round(Number(pointsGas) * 1.2),
          gasPrice: pointsGasPrice.toString()
        }, adminAccount.privateKey);

        await web3.eth.sendSignedTransaction(signedPoints.rawTransaction);
        console.log('Added points to token:', tokenId);

      } catch (error) {
        console.error('Error during payment approval:', error);
        return res.status(500).json({ error: `Failed to process payment: ${error.message}` });
      }
    }

    reqDoc.status = 'approved';
    await reqDoc.save();
    res.json({ message: 'Approved' });

  } catch (error) {
    console.error('Error in approval process:', error);
    res.status(500).json({ error: `Approval failed: ${error.message}` });
  }
});

// Reject
router.post('/reject', authAdmin, async (req, res) => {
  await Request.findByIdAndUpdate(req.body.requestId, { status: 'rejected' });
  res.json({ message: 'Rejected' });
});

module.exports = router;
