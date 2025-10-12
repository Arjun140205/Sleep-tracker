# Firebase Database Rules and Indexes Setup

## Firebase Realtime Database Rules

Replace your current Firebase Realtime Database rules with these optimized rules:

```json
{
  "rules": {
    "users": {
      ".indexOn": ["email"],
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['name', 'email'])"
      }
    },
    "entries": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "$entryId": {
          ".validate": "newData.hasChildren(['date', 'sleepTime', 'wakeTime', 'duration'])"
        }
      }
    },
    "userGoals": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "newData.hasChildren(['targetSleepHours', 'targetBedtime', 'targetWakeTime'])"
      }
    }
  }
}
```

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `sleeptracker-3eb0b`
3. Navigate to **Realtime Database** → **Rules**
4. Replace the existing rules with the rules above
5. Click **Publish**

## What These Rules Do

### Security
- **Authentication Required**: All data requires user authentication
- **User Isolation**: Users can only access their own data
- **Data Validation**: Ensures required fields are present

### Performance
- **Email Index**: Adds `.indexOn: ["email"]` for faster user lookups
- **Structured Access**: Organizes data by user ID for efficient queries

### Data Structure
- **users/$uid**: User profile data (name, email, password hash)
- **entries/$uid**: Sleep entries for each user
- **userGoals/$uid**: Sleep goals and preferences for each user

## Network Connectivity Issues

The Firebase credential error suggests network connectivity issues. Here are solutions:

### Option 1: Check Internet Connection
```bash
# Test connectivity to Google services
ping www.googleapis.com
curl -I https://www.googleapis.com/oauth2/v4/token
```

### Option 2: Use Environment Variables Instead
If network issues persist, use individual environment variables in your `.env` file:

```env
# Replace with your actual Firebase credentials
FIREBASE_PROJECT_ID=sleeptracker-3eb0b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@sleeptracker-3eb0b.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://sleeptracker-3eb0b-default-rtdb.firebaseio.com/
```

### Option 3: Firewall/Proxy Configuration
If you're behind a corporate firewall:
- Ensure access to `*.googleapis.com`
- Configure proxy settings if needed
- Check with your network administrator

## Testing the Configuration

After applying the rules, test with these commands:

```bash
# Start your server
cd server
npm start

# In another terminal, test the API
curl http://localhost:5001/api/health
```

Look for these success messages:
```
🚀 Firebase initialized successfully!
📊 Using credential source: [your method]
🗄️  Database URL: https://sleeptracker-3eb0b-default-rtdb.firebaseio.com
```

## Troubleshooting

### If you still see "ENOTFOUND www.googleapis.com"
1. Check your internet connection
2. Try using a different network (mobile hotspot)
3. Restart your router/modem
4. Contact your ISP if the issue persists

### If you see "Permission denied"
1. Verify your Firebase service account has the correct permissions
2. Check that your database rules are published
3. Ensure you're using the correct project ID

### If the app works but shows warnings
The app will fall back to mock database mode, which is fine for development. The warnings won't affect functionality but should be resolved for production use.