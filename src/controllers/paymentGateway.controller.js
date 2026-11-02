const mongoose = require("mongoose");
const PaymentGateway = require("../models/PaymentGateway.model");
const { encrypt } = require("../utils/encryption");

const gatewayFields = {
  jazzcash: ["merchantId", "password", "integritySalt"],
  easypaisa: ["storeId", "hashKey"],
  stripe: ["publishableKey", "secretKey"],
  bankTransfer: [
    "bankName",
    "accountTitle",
    "accountNumber",
    "iban",
    "swiftCode",
    "routingNumber",
  ],
};

const secretFields = new Set([
  "password",
  "integritySalt",
  "hashKey",
  "secretKey",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validatePayload(body) {
  if (!isObject(body)) return "Request body must be an object.";

  const sections = Object.keys(body);
  const allowedSections = Object.keys(gatewayFields);

  if (
    sections.length === 0 ||
    sections.some((section) => !allowedSections.includes(section))
  ) {
    return "Provide valid gateway settings.";
  }

  for (const section of sections) {
    const config = body[section];

    if (!isObject(config)) return `Invalid settings for ${section}.`;

    const allowed = ["isActive", ...gatewayFields[section]];
    const fields = Object.keys(config);

    if (
      fields.length === 0 ||
      fields.some((field) => !allowed.includes(field))
    ) {
      return `Invalid fields for ${section}.`;
    }

    if (
      Object.hasOwn(config, "isActive") &&
      typeof config.isActive !== "boolean"
    ) {
      return `${section}.isActive must be true or false.`;
    }

    for (const field of gatewayFields[section]) {
      if (
        Object.hasOwn(config, field) &&
        typeof config[field] !== "string"
      ) {
        return `${section}.${field} must be a string.`;
      }
    }
  }

  return null;
}

function getSchoolId(req, res) {
  const schoolId = req.user && req.user.schoolId;

  if (!schoolId || !mongoose.isValidObjectId(schoolId)) {
    res.status(403).json({
      success: false,
      message: "A valid school association is required.",
    });
    return null;
  }

  return schoolId;
}

function responseData(gateway) {
  return {
    _id: gateway._id,
    jazzcash: {
      isActive: gateway.jazzcash.isActive,
      merchantId: gateway.jazzcash.merchantId,
      hasPassword: Boolean(gateway.jazzcash.password),
      hasSalt: Boolean(gateway.jazzcash.integritySalt),
    },
    easypaisa: {
      isActive: gateway.easypaisa.isActive,
      storeId: gateway.easypaisa.storeId,
      hasHashKey: Boolean(gateway.easypaisa.hashKey),
    },
    stripe: {
      isActive: gateway.stripe.isActive,
      publishableKey: gateway.stripe.publishableKey,
      hasSecretKey: Boolean(gateway.stripe.secretKey),
    },
    bankTransfer: {
      isActive: gateway.bankTransfer.isActive,
      bankName: gateway.bankTransfer.bankName,
      accountTitle: gateway.bankTransfer.accountTitle,
      accountNumber: gateway.bankTransfer.accountNumber,
      iban: gateway.bankTransfer.iban,
      swiftCode: gateway.bankTransfer.swiftCode,
      routingNumber: gateway.bankTransfer.routingNumber,
    },
  };
}

exports.getGateways = async (req, res) => {
  const schoolId = getSchoolId(req, res);
  if (!schoolId) return;

  try {
    let gateway = await PaymentGateway.findOne({ schoolId });

    if (!gateway) {
      gateway = await PaymentGateway.create({ schoolId });
    }

    return res.status(200).json({
      success: true,
      data: responseData(gateway),
    });
  } catch (error) {
    console.error("Failed to retrieve payment gateway settings:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve payment gateway settings.",
    });
  }
};

exports.updateGateways = async (req, res) => {
  const schoolId = getSchoolId(req, res);
  if (!schoolId) return;

  const validationError = validatePayload(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError,
    });
  }

  try {
    const updates = {};

    for (const [section, config] of Object.entries(req.body)) {
      for (const [field, value] of Object.entries(config)) {
        if (secretFields.has(field) && value !== "") {
          updates[`${section}.${field}`] = encrypt(value);
        } else {
          updates[`${section}.${field}`] = value;
        }
      }
    }

    await PaymentGateway.findOneAndUpdate(
      { schoolId },
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Gateways updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update payment gateway settings:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update payment gateway settings.",
    });
  }
};
