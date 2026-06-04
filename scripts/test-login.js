const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const fs = require("fs");
const path = require("path");

// Parse env variables from .env.local
const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function run() {
  const email = "pranay.sc25m147@pg.iist.ac.in";
  const password = "SC25M147";
  console.log(`Attempting login for ${email} with password: ${password}...`);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("✓ Success! Login established. User ID:", cred.user.uid);
  } catch (e) {
    console.error("✗ Failed:", e.code, e.message);
  }
  process.exit(0);
}

run();
