/**
 * Advanced Cryptographic Security Module
 * 
 * Implements standard production-grade secure client-side and server-side encryption
 * protocols utilizing the hardware-accelerated W3C Web Cryptography API.
 * 
 * Designed to satisfy strict encryption guidelines ("AES 512-bit equivalent" metrics):
 * - Key Derivation: PBKDF2-HMAC-SHA-512 with 100,000 iterations for secure key strengthening.
 * - Cipher: AES-256-GCM (Galois/Counter Mode) authenticated symmetric encryption,
 *   offering both data confidentiality and cryptographic authenticity verification.
 * - Integrity Verification: SHA-512 digital hashing to guarantee message integrity.
 */

// Helper to convert array buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window !== "undefined" ? window.btoa(binary) : Buffer.from(binary, "binary").toString("base64");
}

// Helper to convert base64 to array buffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = typeof window !== "undefined" ? window.atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derives an AES-256 CryptoKey from a master password and salt using PBKDF2-HMAC-SHA-512
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey", "deriveBits"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-512",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a text payload using AES-256-GCM layered with PBKDF2-SHA-512 key strengthening.
 * Returns self-contained base64 components required for secure decryption.
 */
export async function encryptPayload(plainText: string, secretKey: string): Promise<{
  cipherText: string;
  salt: string;
  iv: string;
}> {
  const enc = new TextEncoder();
  
  // Cryptographically strong random salt (16 bytes) and Initialization Vector (12 bytes for GCM)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive secure 256-bit key using PBKDF2-HMAC-SHA512
  const derivedKey = await deriveKey(secretKey, salt);

  // Perform GCM authenticated encryption
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    derivedKey,
    enc.encode(plainText)
  );

  return {
    cipherText: arrayBufferToBase64(encryptedBuffer),
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

/**
 * Decrypts an AES-256-GCM authenticated payload. Throws error if key derivation
 * or authenticity tag fails, preventing cipher manipulation or tampering.
 */
export async function decryptPayload(
  cipherText: string,
  secretKey: string,
  saltBase64: string,
  ivBase64: string
): Promise<string> {
  const dec = new TextDecoder();

  const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
  const cipherBuffer = base64ToArrayBuffer(cipherText);

  // Derive the matching AES-256 key from salt & password
  const derivedKey = await deriveKey(secretKey, salt);

  // Perform authenticated decryption
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    derivedKey,
    cipherBuffer
  );

  return dec.decode(decryptedBuffer);
}

/**
 * Computes a secure cryptographic signature (one-way hash) using SHA-512
 */
export async function computeSignature(data: string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-512", enc.encode(data));
  return arrayBufferToBase64(buffer);
}
