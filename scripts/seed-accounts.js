const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signOut } = require("firebase/auth");
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

const users = [
  // 2025 batch
  { email: "aniket.sc25m141@pg.iist.ac.in", password: "SC25M141" },
  { email: "anushyanth.sc25m142@pg.iist.ac.in", password: "SC25M142" },
  { email: "juveriya.sc25m143@pg.iist.ac.in", password: "SC25M143" },
  { email: "lakshmi.sc25m144@pg.iist.ac.in", password: "SC25M144" },
  { email: "shivam.sc25m145@pg.iist.ac.in", password: "SC25M145" },
  { email: "bishodeep.sc25m146@pg.iist.ac.in", password: "SC25M146" },
  { email: "pranay.sc25m147@pg.iist.ac.in", password: "SC25M147" },
  { email: "abdullah.sc25m179@pg.iist.ac.in", password: "SC25M179" },

  // 2024 batch
  { email: "arun.sc24m021@pg.iist.ac.in", password: "SC24M021" },
  { email: "pushpal.sc24m022@pg.iist.ac.in", password: "SC24M022" },
  { email: "naisha.sc24m023@pg.iist.ac.in", password: "SC24M023" },
  { email: "divya.sc24m024@pg.iist.ac.in", password: "SC24M024" },
  { email: "dinesh.sc24m025@pg.iist.ac.in", password: "SC24M025" },
  { email: "gayathri.sc24m026@pg.iist.ac.in", password: "SC24M026" },
  { email: "arjun.sc24m027@pg.iist.ac.in", password: "SC24M027" }
];

async function run() {
  console.log("Starting Firebase Auth Seeding...");
  for (const user of users) {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      await signOut(auth);
      console.log(`✓ Created: ${user.email}`);
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        console.log(`- Exists: ${user.email}`);
      } else {
        console.error(`✗ Failed ${user.email}:`, e.message || e);
      }
    }
  }
  console.log("Firebase Auth Seeding Finished.");
  process.exit(0);
}

run();
