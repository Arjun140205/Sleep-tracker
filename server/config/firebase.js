const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Initialize Firebase Admin
let db;

console.log("🔧 Initializing Firebase configuration...");

try {
  let firebaseConfig = null;
  let credentialSource = null;

  // Method 1: Using service account JSON file (if it exists)
  try {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      
      // Validate the service account has required fields
      if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
        firebaseConfig = {
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sleeptracker-3eb0b-default-rtdb.firebaseio.com"
        };
        credentialSource = "service account JSON file";
        console.log("✅ Found valid service account JSON file");
      } else {
        console.log("❌ Service account JSON file exists but is missing required fields");
      }
    } else {
      console.log("⚠️  Service account JSON file not found at:", serviceAccountPath);
    }
  } catch (fileError) {
    console.log("❌ Error reading service account JSON file:", fileError.message);
  }

  // Method 2: Using complete service account JSON from environment variable
  if (!firebaseConfig && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      // Validate the service account has required fields
      if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
        firebaseConfig = {
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sleeptracker-3eb0b-default-rtdb.firebaseio.com"
        };
        credentialSource = "environment variable (FIREBASE_SERVICE_ACCOUNT)";
        console.log("✅ Found valid service account in environment variable");
      } else {
        console.log("❌ FIREBASE_SERVICE_ACCOUNT is missing required fields");
      }
    } catch (parseError) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", parseError.message);
    }
  }

  // Method 3: Using individual environment variables
  if (!firebaseConfig && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
      firebaseConfig = {
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://sleeptracker-3eb0b-default-rtdb.firebaseio.com"
      };
      credentialSource = "individual environment variables";
      console.log("✅ Found valid individual environment variables");
    } catch (envError) {
      console.error("❌ Error with individual environment variables:", envError.message);
    }
  }

  if (firebaseConfig) {
    admin.initializeApp(firebaseConfig);
    db = admin.database();
    console.log("🚀 Firebase initialized successfully!");
    console.log("📊 Using credential source:", credentialSource);
    console.log("🗄️  Database URL:", firebaseConfig.databaseURL);
  } else {
    throw new Error("No valid Firebase configuration found");
  }

} catch (error) {
  console.error("🔥 Firebase initialization failed:", error.message);
  console.warn("🔄 Falling back to mock database for development.");
  console.log("\n📋 To configure Firebase, you need to:");
  console.log("1. 📄 Create serviceAccountKey.json in the config folder with your Firebase service account key, OR");
  console.log("2. 🌍 Set FIREBASE_SERVICE_ACCOUNT environment variable with complete JSON, OR");
  console.log("3. 🔧 Set individual environment variables:");
  console.log("   - FIREBASE_PROJECT_ID");
  console.log("   - FIREBASE_PRIVATE_KEY");
  console.log("   - FIREBASE_CLIENT_EMAIL");
  console.log("\n🔑 To get your Firebase service account key:");
  console.log("1. Go to Firebase Console > Project Settings > Service Accounts");
  console.log("2. Click 'Generate new private key'");
  console.log("3. Download the JSON file and save it as serviceAccountKey.json in the config folder");
  
  // Enhanced mock database for better development experience
  db = {
    ref: (path) => ({
      push: (data) => {
        const key = Date.now().toString();
        console.log(`📦 Mock DB: Pushing to ${path}:`, data);
        return Promise.resolve({ key });
      },
      child: (key) => ({
        set: (data) => {
          console.log(`📝 Mock DB: Setting ${path}/${key}:`, data);
          return Promise.resolve();
        }
      }),
      once: (eventType) => {
        console.log(`📖 Mock DB: Reading from ${path}`);
        return Promise.resolve({ 
          exists: () => false,
          val: () => null,
          forEach: () => {}
        });
      },
      orderByChild: (child) => ({
        equalTo: (value) => ({
          once: (eventType) => {
            console.log(`🔍 Mock DB: Querying ${path} where ${child} = ${value}`);
            return Promise.resolve({ 
              exists: () => false,
              val: () => null,
              forEach: () => {}
            });
          }
        })
      })
    })
  };
}

module.exports = db;