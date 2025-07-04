const admin = require("firebase-admin");

// Initialize Firebase Admin using environment variables or a mock setup for development
let db;

try {
  // Try to initialize with service account from environment variables
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://YOUR_PROJECT_ID.firebaseio.com"
    });
    db = admin.database();
  } else {
    // For development without Firebase, create a mock database
    console.warn("Firebase not configured. Using mock database for development.");
    db = {
      ref: (path) => ({
        push: (data) => Promise.resolve({ key: Date.now().toString() }),
        once: (eventType) => Promise.resolve({ val: () => null }),
        orderByChild: () => ({
          equalTo: () => ({
            once: (eventType) => Promise.resolve({ val: () => null })
          })
        })
      })
    };
  }
} catch (error) {
  console.error("Firebase initialization failed:", error.message);
  // Fallback to mock database
  db = {
    ref: (path) => ({
      push: (data) => Promise.resolve({ key: Date.now().toString() }),
      once: (eventType) => Promise.resolve({ val: () => null }),
      orderByChild: () => ({
        equalTo: () => ({
          once: (eventType) => Promise.resolve({ val: () => null })
        })
      })
    })
  };
}

module.exports = db;