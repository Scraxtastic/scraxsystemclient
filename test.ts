// import * as Random from "expo-crypto";
// import { Buffer } from "buffer";

// console.log("key", Random.getRandomBytesAsync(32));
// console.log("iv", Random.getRandomBytesAsync(16));

// const test = async () => {
//   const iv = Buffer.from(await Random.getRandomBytesAsync(16));
//   console.log("iv:", iv.toString("base64"));
//   const key = Buffer.from(await Random.getRandomBytesAsync(32));
//   console.log("key:", key.toString("base64"));
// };
// test();

// // Encrypt
// const encrypt = (plaintext: string, key: Buffer, iv: Buffer): string => {
//   const keyHex = CryptoJS.enc.Base64.parse(key.toString("base64"));
//   const ivHex = CryptoJS.enc.Base64.parse(iv.toString("base64"));

//   const encrypted = CryptoJS.AES.encrypt(plaintext, keyHex, {
//     iv: ivHex,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return encrypted.toString();
// };

// // Decrypt
// const decrypt = (ciphertext: string, key: Buffer, iv: Buffer): string => {
//   const keyHex = CryptoJS.enc.Base64.parse(key.toString("base64"));
//   const ivHex = CryptoJS.enc.Base64.parse(iv.toString("base64"));

//   const decrypted = CryptoJS.AES.decrypt(ciphertext, keyHex, {
//     iv: ivHex,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// console.log("CryptoJS:");
// // Usage
// const key = Buffer.from(
//   "bi7kdNhA7R3ZsMkv5Ct5Ka0o+hDeDq8h4MzDUzEnZh8=",
//   "base64"
// );
// const iv = Buffer.from("oVtoejvQgwxp4h67oKQJ/w==", "base64");
// // const key = "your-256-bit-secret-key"; // Must be 256 bits (32 characters)
// // const iv = "your-128-bit-iv"; // Must be 128 bits (16 characters)
// const data = "Hello, World!";

// const encryptedData = encrypt(data, key, iv);
// console.log("Encrypted:", encryptedData);

// const decryptedData = decrypt(encryptedData, key, iv);
// console.log("Decrypted:", decryptedData);

// console.log("Modes", Object.keys(CryptoJS.mode));
// console.log("Paddings", Object.keys(CryptoJS.pad));
// console.log("Encodings", Object.keys(CryptoJS.enc));
