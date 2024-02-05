import CryptoJS, { enc } from "crypto-js";
import { Buffer } from "buffer";
import * as Random from "expo-crypto";

const key = Buffer.from(
  "5Sj911TQZ+VbLhXzfFXbf5L+t2SqGGfd9lD7IPF3pGU=",
  "base64"
);
const iv = Buffer.from("bBV6sUrpWIFaRpQuTcYOEA==", "base64");
const ivLength = 16;

const encryptFileData = (data: Buffer): string => {
  return encryptData(data, key, iv);
};

const decryptFileData = (encryptedData: string): string => {
  return decryptData(encryptedData, key, iv);
};
// Encrypt
const encryptData = (data: Buffer, key: Buffer, iv: Buffer): string => {
  const dataWordArray = CryptoJS.lib.WordArray.create(data);
  const keyWordArray = CryptoJS.lib.WordArray.create(key);
  const ivWordArray = CryptoJS.lib.WordArray.create(iv);

  const encrypted = CryptoJS.AES.encrypt(dataWordArray, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

// Decrypt
const decryptData = (
  encryptedData: string,
  key: Buffer,
  iv: Buffer,
  encoding = CryptoJS.enc.Utf8
): string => {
  const keyWordArray = CryptoJS.lib.WordArray.create(key);
  const ivWordArray = CryptoJS.lib.WordArray.create(iv);

  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(encoding);
};

const packageData = (iv: Buffer, encryptedData: Buffer): Buffer => {
  return Buffer.concat([iv, encryptedData]);
};

const unpackageData = (
  dataPackage: Buffer
): { iv: Buffer; encryptedData: Buffer } => {
  const iv = Buffer.from(dataPackage.subarray(0, ivLength));
  const encryptedData = Buffer.from(
    dataPackage.subarray(ivLength, dataPackage.length)
  );

  return { iv, encryptedData };
};

const encryptAndPackageData = (
  data: Buffer,
  key: Buffer,
  iv: Buffer = Buffer.from(Random.getRandomBytes(ivLength))
): Buffer => {
  const encryptedData = encryptData(data, key, iv);
  return packageData(iv, Buffer.from(encryptedData, "base64"));
};

const unpackageAndDecryptData = (
  dataPackage: Buffer,
  key: Buffer,
  encoding = CryptoJS.enc.Utf8
): Buffer => {
  const { iv, encryptedData } = unpackageData(dataPackage);
  return Buffer.from(
    decryptData(encryptedData.toString("base64"), key, iv, encoding)
  );
};

export {
  encryptFileData,
  decryptFileData,
  encryptData,
  decryptData,
  packageData,
  unpackageData,
  encryptAndPackageData,
  unpackageAndDecryptData,
};
