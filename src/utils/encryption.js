const crypto = require("crypto");

function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;

  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error(
      "ENCRYPTION_KEY must be configured as a 64-character hexadecimal key."
    );
  }

  return Buffer.from(key, "hex");
}

function encrypt(text) {
  if (text === undefined || text === null || text === "") return text;

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(text), "utf8"),
    cipher.final(),
  ]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(text) {
  if (text === undefined || text === null || text === "") return text;

  const parts = text.split(":");
  if (parts.length !== 2 || !/^[0-9a-fA-F]{32}$/.test(parts[0])) {
    throw new Error("Invalid encrypted value format.");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}

module.exports = { encrypt, decrypt };
