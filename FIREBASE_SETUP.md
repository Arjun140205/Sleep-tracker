# Firebase Setup Guide for Sleep Tracker

## Quick Setup (Recommended)

### Step 1: Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sleeptracker-3eb0b`
3. Click the gear icon (⚙️) → **Project settings**
4. Go to the **Service accounts** tab
5. Click **"Generate new private key"**
6. Download the JSON file

### Step 2: Configure Firebase Credentials

**Option A: Using JSON File (Easiest)**
1. Rename the downloaded file to `serviceAccountKey.json`
2. Move it to: `/Users/arjunbirsingh/Documents/Projects/Sleep-Tracker/server/config/serviceAccountKey.json`

**Option B: Using Environment Variables**
1. Open the `.env` file in the server folder
2. Replace the placeholder values with your actual Firebase credentials:

```env
FIREBASE_PROJECT_ID=sleeptracker-3eb0b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@sleeptracker-3eb0b.iam.gserviceaccount.com
```

### Step 3: Test the Configuration

1. Restart your server:
   ```bash
   cd /Users/arjunbirsingh/Documents/Projects/Sleep-Tracker/server
   npm start
   ```

2. Look for this message in the console:
   ```
   🚀 Firebase initialized successfully!
   📊 Using credential source: service account JSON file
   🗄️  Database URL: https://sleeptracker-3eb0b-default-rtdb.firebaseio.com
   ```

## Troubleshooting

### If you see "🔄 Falling back to mock database"
- Your Firebase credentials are not configured correctly
- Check that your service account JSON file exists and has the correct format
- Verify your environment variables are set correctly

### If you get permission errors
- Make sure your Firebase service account has the correct permissions
- Check that your Firebase Realtime Database rules allow read/write access

### Firebase Database Rules
Make sure your Firebase Realtime Database has appropriate rules. For development, you can use:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

## Security Notes

- Never commit `serviceAccountKey.json` to version control
- The `.gitignore` file should include `serviceAccountKey.json`
- For production, use environment variables instead of JSON files
- Keep your Firebase credentials secure and never share them publicly
