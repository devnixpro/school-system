const mongoose = require("mongoose");

const paymentGatewaySchema = new mongoose.Schema({
  schoolId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "School", 
    required: true, 
    unique: true 
  },
  jazzcash: { 
    isActive: { type: Boolean, default: false }, 
    merchantId: { type: String, default: "" }, 
    password: { type: String, default: "" }, 
    integritySalt: { type: String, default: "" } 
  },
  easypaisa: { 
    isActive: { type: Boolean, default: false }, 
    storeId: { type: String, default: "" }, 
    hashKey: { type: String, default: "" } 
  },
  stripe: { 
    isActive: { type: Boolean, default: false }, 
    publishableKey: { type: String, default: "" }, 
    secretKey: { type: String, default: "" } 
  },
  bankTransfer: { 
    isActive: { type: Boolean, default: true }, 
    bankName: { type: String, default: "" }, 
    accountTitle: { type: String, default: "" }, 
    accountNumber: { type: String, default: "" }, 
    iban: { type: String, default: "" },
    swiftCode: { type: String, default: "" },
    routingNumber: { type: String, default: "" }
  }
}, { timestamps: true });

module.exports = mongoose.model("PaymentGateway", paymentGatewaySchema);