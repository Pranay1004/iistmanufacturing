/**
 * Shared Firebase Admin SDK initialization.
 *
 * Centralizes admin setup so it's not duplicated across API routes.
 * Security: never logs credentials, uses generic error messages.
 */
import admin from "firebase-admin";
import fs from "fs";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const storageBucketName =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "iist-manufacturing-profile.firebasestorage.app";

function initAdmin() {
  if (admin.apps.length) return; // already initialized

  try {
    if (serviceAccountJson) {
      const sa = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(sa),
        storageBucket: storageBucketName,
      });
      return;
    }

    if (serviceAccountPath) {
      // Could be inline JSON or a file path
      if (serviceAccountPath.trim().startsWith("{")) {
        const sa = JSON.parse(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(sa),
          storageBucket: storageBucketName,
        });
        return;
      }

      if (fs.existsSync(serviceAccountPath)) {
        const sa = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        admin.initializeApp({
          credential: admin.credential.cert(sa),
          storageBucket: storageBucketName,
        });
        return;
      }
    }

    // No credentials available — admin features won't work
    console.warn("[Firebase Admin] No service account configured. Admin features disabled.");
  } catch (e) {
    // Log generic message — never log the credential content
    console.error("[Firebase Admin] Initialization failed. Check service account configuration.");
  }
}

// Run once on module load
initAdmin();

export { admin };
export const isAdminReady = admin.apps.length > 0;
