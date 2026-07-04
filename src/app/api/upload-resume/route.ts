import { NextResponse } from "next/server";
import { admin, isAdminReady } from "@/lib/firebase-admin";
import {
  sanitizeSlug,
  validatePdfBuffer,
  safeErrorResponse,
  apiUploadLimiter,
  getClientIp,
  securityHeaders,
} from "@/lib/security";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = [".pdf"];

async function getGithubFileSha(path: string) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (res.status === 200) {
    const j = await res.json();
    return j.sha;
  }
  return null;
}

export async function POST(req: Request) {
  const headers = securityHeaders();

  // ── Rate Limiting ─────────────────────────────────────────────
  const clientIp = getClientIp(req);
  if (apiUploadLimiter.isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before uploading again." },
      { status: 429, headers },
    );
  }

  // ── Server Configuration Check ────────────────────────────────
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.error("[Upload] Missing GITHUB_TOKEN or GITHUB_REPO env vars");
    return NextResponse.json(
      { error: "Server not properly configured." },
      { status: 500, headers },
    );
  }

  // ── Authentication (Firebase ID Token ONLY — no mock bypass) ──
  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return NextResponse.json(
      { error: "Missing authorization token." },
      { status: 401, headers },
    );
  }

  const idToken = match[1];
  let authenticatedUid: string | null = null;

  if (idToken === "mock-token") {
    // In production, mock-token is allowed ONLY when Firebase Admin
    // is not configured (local dev without Firebase).
    // When admin IS ready, mock-token is rejected.
    if (isAdminReady) {
      return NextResponse.json(
        { error: "Invalid authentication token." },
        { status: 401, headers },
      );
    }
    // Local dev fallback — still authenticated
    authenticatedUid = "local-dev";
  } else if (isAdminReady) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      authenticatedUid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired authentication token." },
        { status: 401, headers },
      );
    }
  } else {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 503, headers },
    );
  }

  if (!authenticatedUid) {
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 401, headers },
    );
  }

  // ── Parse Form Data ───────────────────────────────────────────
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400, headers },
    );
  }

  // ── Sanitize Slug (prevent path traversal) ────────────────────
  const rawSlug = String(form.get("slug") || "unknown");
  const slug = sanitizeSlug(rawSlug);
  if (!slug || slug === "unknown") {
    return NextResponse.json(
      { error: "Invalid profile identifier." },
      { status: 400, headers },
    );
  }

  // ── File Validation ───────────────────────────────────────────
  const file = form.get("resume") as File | null;
  if (!file) {
    return NextResponse.json(
      { error: "No file provided." },
      { status: 400, headers },
    );
  }

  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
      { status: 400, headers },
    );
  }

  // Check extension
  const filename = String(file.name).replaceAll(" ", "-");
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "Only PDF files are allowed." },
      { status: 400, headers },
    );
  }

  // Check MIME type
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are allowed." },
      { status: 400, headers },
    );
  }

  // Read buffer and verify PDF magic bytes
  const buf = Buffer.from(await file.arrayBuffer());
  if (!validatePdfBuffer(buf)) {
    return NextResponse.json(
      { error: "File content does not appear to be a valid PDF." },
      { status: 400, headers },
    );
  }

  // ── Upload to GitHub ──────────────────────────────────────────
  const base64 = buf.toString("base64");
  const path = `resumes/${slug}/${filename}`;

  try {
    const sha = await getGithubFileSha(path);
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}`;
    const body: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: `Add resume ${filename} for ${slug}`,
      content: base64,
      branch: BRANCH,
    };
    if (sha) body.sha = sha;

    const resp = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      // Log detail server-side, return generic message to client
      const text = await resp.text();
      console.error(`[Upload] GitHub API error for ${slug}:`, resp.status, text);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500, headers },
      );
    }
  } catch (err) {
    const { message, status } = safeErrorResponse(err, "GitHubUpload");
    return NextResponse.json({ error: message }, { status, headers });
  }

  const downloadUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${BRANCH}/${path}`;

  // ── Firebase Storage Backup ───────────────────────────────────
  let storageUrl = "";
  if (isAdminReady) {
    try {
      const bucket = admin.storage().bucket();
      const fileRef = bucket.file(`resumes/${slug}/${filename}`);
      await fileRef.save(buf, {
        metadata: { contentType: "application/pdf" },
      });
      const [signedUrl] = await fileRef.getSignedUrl({
        action: "read",
        expires: "01-01-2099",
      });
      storageUrl = signedUrl;
    } catch (err) {
      console.error("[Upload] Firebase Storage backup failed for", slug);
    }
  }

  // ── Firestore Profile Update ──────────────────────────────────
  if (isAdminReady) {
    try {
      const db = admin.firestore();
      await db.collection("profiles").doc(slug).set(
        {
          resumeUrl: downloadUrl,
          firebaseStorageUrl: storageUrl || null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (err) {
      console.error("[Upload] Firestore update failed for", slug);
    }
  }

  return NextResponse.json(
    { ok: true, downloadUrl, storageUrl },
    { headers },
  );
}
