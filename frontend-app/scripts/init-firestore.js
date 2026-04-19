/*
  Firestore bootstrap script for Mental Health App.

  What it creates:
  - app_config/schema
  - questionnaires/PHQ9_v1
  - users/{uid} (optional demo user)
  - users/{uid}/phq_cycles/bootstrap (optional)
  - users/{uid}/sensor_buckets/bootstrap (optional)

  Usage:
    node scripts/init-firestore.js --serviceAccount ./serviceAccountKey.json
    node scripts/init-firestore.js --serviceAccount ./serviceAccountKey.json --userId test-user
    node scripts/init-firestore.js --serviceAccount ./serviceAccountKey.json --projectId mental-health-app-fc529
*/

const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

function loadServiceAccount(serviceAccountPath) {
  const abs = path.resolve(process.cwd(), serviceAccountPath);
  assertFileExists(abs);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

function buildPhq9() {
  return {
    code: "PHQ9",
    version: 1,
    title: "Patient Health Questionnaire-9",
    description: "Standard PHQ-9 questionnaire",
    maxScore: 27,
    options: [
      { score: 0, label: "Not at all" },
      { score: 1, label: "Several days" },
      { score: 2, label: "More than half the days" },
      { score: 3, label: "Nearly every day" },
    ],
    questions: [
      { order: 1, text: "Little interest or pleasure in doing things" },
      { order: 2, text: "Feeling down, depressed, or hopeless" },
      { order: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
      { order: 4, text: "Feeling tired or having little energy" },
      { order: 5, text: "Poor appetite or overeating" },
      {
        order: 6,
        text: "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
      },
      {
        order: 7,
        text: "Trouble concentrating on things, such as reading or watching television",
      },
      {
        order: 8,
        text: "Moving or speaking slowly, or being so fidgety/restless that others could notice",
      },
      {
        order: 9,
        text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
      },
    ],
    isActive: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function run() {
  const serviceAccountPath = getArg("--serviceAccount");
  const projectIdArg = getArg("--projectId");
  const userId = getArg("--userId");

  if (!serviceAccountPath) {
    throw new Error(
      "Missing required --serviceAccount argument. Example: --serviceAccount ./serviceAccountKey.json",
    );
  }

  const serviceAccount = loadServiceAccount(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectIdArg || serviceAccount.project_id,
  });

  const db = admin.firestore();

  const batch = db.batch();

  const schemaRef = db.collection("app_config").doc("schema");
  batch.set(
    schemaRef,
    {
      schemaVersion: 1,
      databaseType: "firestore",
      sensorStorageStrategy: "bucketed-documents",
      phqTrackingStrategy: "cycle-instance",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const phqRef = db.collection("questionnaires").doc("PHQ9_v1");
  batch.set(phqRef, buildPhq9(), { merge: true });

  if (userId) {
    const userRef = db.collection("users").doc(userId);
    batch.set(
      userRef,
      {
        profile: {
          displayName: "Demo User",
          timezone: "UTC",
        },
        onboarding: {
          hasOnboarded: false,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const cycleBootstrapRef = userRef
      .collection("phq_cycles")
      .doc("bootstrap");
    batch.set(
      cycleBootstrapRef,
      {
        note: "Collection bootstrap document. Replace with real cycles.",
        cycleNumber: 0,
        status: "bootstrap",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const sensorBootstrapRef = userRef
      .collection("sensor_buckets")
      .doc("bootstrap");
    batch.set(
      sensorBootstrapRef,
      {
        note: "Collection bootstrap document. Replace with real bucket docs.",
        sensorType: "bootstrap",
        bucketStart: null,
        bucketEnd: null,
        count: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();

  const projectId = admin.app().options.projectId;
  console.log("Firestore bootstrap completed.");
  console.log(`Project: ${projectId}`);
  console.log("Created/updated docs:");
  console.log("- app_config/schema");
  console.log("- questionnaires/PHQ9_v1");
  if (userId) {
    console.log(`- users/${userId}`);
    console.log(`- users/${userId}/phq_cycles/bootstrap`);
    console.log(`- users/${userId}/sensor_buckets/bootstrap`);
  }

  console.log("\nNext:");
  console.log("1) Add Firestore security rules");
  console.log("2) Create needed composite indexes in Firebase console");
  console.log("3) Remove bootstrap docs once real data flow starts");
}

run().catch((err) => {
  console.error("Failed to initialize Firestore:");
  console.error(err?.message || err);
  process.exit(1);
});
