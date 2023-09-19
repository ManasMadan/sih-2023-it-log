const crypto = require("crypto");
const algorithm = "aes-256-ctr";
let key = process.env.SECRET_KEY;

key = crypto
  .createHash("sha256")
  .update(String(key))
  .digest("base64")
  .substring(0, 32);

const encryptLogs = (logsArray) => {
  const buffer = Buffer.from(JSON.stringify(logsArray));
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};

const decryptLogs = (encrypted) => {
  const iv = encrypted.slice(0, 16);
  encrypted = encrypted.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(result.toString());
};

module.exports = { encryptLogs, decryptLogs };
