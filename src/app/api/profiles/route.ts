import { NextResponse } from "next/server";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const storageBucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "iist-manufacturing-profile.firebasestorage.app";

if (!admin.apps.length) {
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucketName,
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e);
    }
  } else if (serviceAccountPath) {
    if (serviceAccountPath.trim().startsWith("{")) {
      try {
        const serviceAccount = JSON.parse(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: storageBucketName,
        });
      } catch (e) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS as JSON:", e);
      }
    } else if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: storageBucketName,
        });
      } catch (e) {
        console.error("Failed to read/parse GOOGLE_APPLICATION_CREDENTIALS file path:", e);
      }
    }
  }
}

export async function GET() {
  try {
    if (!admin.apps.length) {
      console.warn("[Profiles GET] Firebase admin not initialized - returning empty profiles");
      return NextResponse.json({ profiles: {} });
    }
    const db = admin.firestore();
    const snapshot = await db.collection("profiles").get();
    const profiles: Record<string, any> = {};
    snapshot.forEach((doc) => {
      profiles[doc.id] = doc.data();
    });
    return NextResponse.json({ profiles });
  } catch (error: any) {
    console.error("Error retrieving profiles:", error);
    return NextResponse.json({ profiles: {}, error: error.message || String(error) }, { status: 500 });
  }
}
