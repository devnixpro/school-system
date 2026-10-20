const PaymentGateway = require("../models/PaymentGateway.model");
const { encrypt } = require("../utils/encryption");

exports.getGateways = async (req, res) => {
  try {
    let gateways = await PaymentGateway.findOne({ schoolId: req.user.schoolId });
    
    if (!gateways) {
      gateways = await PaymentGateway.create({ schoolId: req.user.schoolId });
    }

    const responseData = {
      _id: gateways._id,
      jazzcash: {
        isActive: gateways.jazzcash.isActive,
        merchantId: gateways.jazzcash.merchantId,
        hasPassword: !!gateways.jazzcash.password,
        hasSalt: !!gateways.jazzcash.integritySalt,
      },
      easypaisa: {
        isActive: gateways.easypaisa.isActive,
        storeId: gateways.easypaisa.storeId,
        hasHashKey: !!gateways.easypaisa.hashKey,
      },
      stripe: { 
        isActive: gateways.stripe.isActive, 
        publishableKey: gateways.stripe.publishableKey,
        hasSecretKey: !!gateways.stripe.secretKey 
      },
      bankTransfer: {
        isActive: gateways.bankTransfer.isActive,
        bankName: gateways.bankTransfer.bankName,
        accountTitle: gateways.bankTransfer.accountTitle,
        accountNumber: gateways.bankTransfer.accountNumber,
        iban: gateways.bankTransfer.iban,
        swiftCode: gateways.bankTransfer.swiftCode,
        routingNumber: gateways.bankTransfer.routingNumber
      }
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGateways = async (req, res) => {
  try {
    const { jazzcash, easypaisa, stripe, bankTransfer } = req.body;
    const updates = {};
    
    // 1. JazzCash
    if (jazzcash) {
      updates["jazzcash.isActive"] = jazzcash.isActive;
      if (jazzcash.merchantId !== undefined) updates["jazzcash.merchantId"] = jazzcash.merchantId;
      if (jazzcash.password) updates["jazzcash.password"] = encrypt(jazzcash.password);
      if (jazzcash.integritySalt) updates["jazzcash.integritySalt"] = encrypt(jazzcash.integritySalt);
    }

    // 2. EasyPaisa
    if (easypaisa) {
      updates["easypaisa.isActive"] = easypaisa.isActive;
      if (easypaisa.storeId !== undefined) updates["easypaisa.storeId"] = easypaisa.storeId;
      if (easypaisa.hashKey) updates["easypaisa.hashKey"] = encrypt(easypaisa.hashKey);
    }

    // 3. Stripe
    if (stripe) {
      updates["stripe.isActive"] = stripe.isActive;
      if (stripe.publishableKey !== undefined) updates["stripe.publishableKey"] = stripe.publishableKey;
      if (stripe.secretKey) updates["stripe.secretKey"] = encrypt(stripe.secretKey);
    }

    // 4. Bank Transfer
    if (bankTransfer) {
      updates["bankTransfer.isActive"] = bankTransfer.isActive;
      if (bankTransfer.bankName !== undefined) updates["bankTransfer.bankName"] = bankTransfer.bankName;
      if (bankTransfer.accountTitle !== undefined) updates["bankTransfer.accountTitle"] = bankTransfer.accountTitle;
      if (bankTransfer.accountNumber !== undefined) updates["bankTransfer.accountNumber"] = bankTransfer.accountNumber;
      if (bankTransfer.iban !== undefined) updates["bankTransfer.iban"] = bankTransfer.iban;
      if (bankTransfer.swiftCode !== undefined) updates["bankTransfer.swiftCode"] = bankTransfer.swiftCode;
      if (bankTransfer.routingNumber !== undefined) updates["bankTransfer.routingNumber"] = bankTransfer.routingNumber;
    }

    await PaymentGateway.findOneAndUpdate(
      { schoolId: req.user.schoolId },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Gateways updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};