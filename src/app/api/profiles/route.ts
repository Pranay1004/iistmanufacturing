import { NextResponse } from "next/server";
import { admin, isAdminReady } from "@/lib/firebase-admin";
import {
  apiProfilesLimiter,
  getClientIp,
  securityHeaders,
} from "@/lib/security";

export async function GET(req: Request) {
  const headers = securityHeaders();

  // ── Rate Limiting ─────────────────────────────────────────────
  const clientIp = getClientIp(req);
  if (apiProfilesLimiter.isRateLimited(clientIp)) {
    return NextResponse.json(
      { profiles: {}, error: "Too many requests. Please try again later." },
      { status: 429, headers },
    );
  }

  // ── Fetch Profiles ────────────────────────────────────────────
  try {
    if (!isAdminReady) {
      return NextResponse.json({ profiles: {} }, { headers });
    }

    const db = admin.firestore();
    const snapshot = await db.collection("profiles").get();
    const profiles: Record<string, Record<string, unknown>> = {};
    snapshot.forEach((doc) => {
      profiles[doc.id] = doc.data();
    });

    return NextResponse.json({ profiles }, { headers });
  } catch (error) {
    // Log full error server-side, return generic message to client
    console.error("[Profiles GET] Error retrieving profiles:", error);
    return NextResponse.json(
      { profiles: {}, error: "Something went wrong. Please try again later." },
      { status: 500, headers },
    );
  }
}
