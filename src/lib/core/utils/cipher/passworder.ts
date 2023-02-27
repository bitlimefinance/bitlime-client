

import { globals } from "svelte/internal"
import { Buffer } from "buffer/";

// types

type SaltedKey = {
  salt: string
  key: CryptoKey
}

type EncryptedVault = {
  salt: string
  initializationVector: string
  cipherText: string
  stringified?: string
}


// methods

const bufferToBase64 = (b: ArrayBuffer): string => {
  return Buffer.from(b).toString('base64');
}

const base64ToBuffer = (base64: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

async function generateSalt(): Promise<string> {
  const saltBuffer = crypto.getRandomValues(new Uint8Array(64))
  return bufferToBase64(saltBuffer)
}

async function generateOrRecoverKey(
  password: string,
  existingSalt?: string
): Promise<SaltedKey> {
  const { crypto } = globals;

  const salt = existingSalt || (await generateSalt())

  const encoder = new TextEncoder();

  const derivationKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 1000000,
      hash: "SHA-256",
    },
    derivationKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )

  return {
    key,
    salt,
  }
}


async function encryptMessage(
  message: string | undefined,
  password: string
): Promise<EncryptedVault> {

  if(!message) return Promise.reject('No message to encrypt');

  const encoder = new TextEncoder()
  const encodedPlaintext = encoder.encode(message)

  const { key, salt } = await generateOrRecoverKey(password)
  const initializationVector = crypto.getRandomValues(
    new Uint8Array(16)
  )

  const cipherText = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: initializationVector },
    key,
    encodedPlaintext
  )

  const result = {
    salt,
    initializationVector: bufferToBase64(initializationVector),
    cipherText: bufferToBase64(cipherText),
  }

  return {
    ...result,
    stringified: JSON.stringify(result),
  }
}


async function decryptCipherText(
  vault: EncryptedVault | string,
  password: string
): Promise<string> {

  const { crypto } = globals

  const { initializationVector, salt, cipherText } = vault

  const { key } = await generateOrRecoverKey(password, salt)

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuffer(initializationVector) },
    key,
    base64ToBuffer(cipherText)
  )

  return new TextDecoder().decode(plaintext);
}

export { encryptMessage, decryptCipherText, generateSalt, generateOrRecoverKey, bufferToBase64, base64ToBuffer };

export type { EncryptedVault, SaltedKey };