import { NextResponse } from "next/server";
import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (serviceAccountPath && !admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // format: owner/repo
const BRANCH = process.env.GITHUB_BRANCH || "main";

async function getGithubFileSha(path: string) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } });
  if (res.status === 200) {
    const j = await res.json();
    return j.sha;
  }
  return null;
}

export async function POST(req: Request) {
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return NextResponse.json({ error: "Server not configured: set GITHUB_TOKEN and GITHUB_REPO" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") || "";
  const match = authHeader.match(/Bearer (.+)/);
  if (!match) return NextResponse.json({ error: "Missing Authorization" }, { status: 401 });
  const idToken = match[1];

  try {
    await admin.auth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const form = await req.formData();
  const slug = String(form.get("slug") || "unknown");
  const file = form.get("resume") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const base64 = buf.toString("base64");
  const filename = String(file.name).replaceAll(" ", "-");
  const path = `resumes/${slug}/${filename}`;

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
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: "GitHub upload failed", detail: text }, { status: 500 });
  }
  const j = await resp.json();
  const downloadUrl = j.content && j.content.download_url ? j.content.download_url : `https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}/${path}`;
  return NextResponse.json({ ok: true, downloadUrl });
}

