# Sleep Tracker Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Runtime Errors

#### "Cannot access before initialization" Error
**Problem:** JavaScript function hoisting issues
**Solution:** 
- Refresh the browser (Ctrl+R or Cmd+R)
- Clear browser cache and reload
- This has been fixed in the latest version

#### "Network Error" or "Server Disconnected"
**Problem:** Backend server not running or network issues
**Solutions:**
1. **Start the server:**
   ```bash
   cd server
   npm start
   ```
2. **Check if server is running:**
   - Open http://localhost:5001/api/health in browser
   - Should show: `{"status":"OK","message":"Server is running"}`

3. **Port conflicts:**
   ```bash
   # Check what's using port 5001
   lsof -i :5001
   # Kill the process if needed
   kill -9 [PID]
   ```

### 🔥 Firebase Issues

#### "ENOTFOUND www.googleapis.com" Error
**Problem:** Network connectivity to Google services
**Solutions:**
1. **Check internet connection:**
   ```bash
   ping www.googleapis.com
   ```

2. **Firewall/Proxy issues:**
   - Ensure access to `*.googleapis.com`
   - Try different network (mobile hotspot)
   - Contact network administrator

3. **Use environment variables instead:**
   ```env
   FIREBASE_PROJECT_ID=sleeptracker-3eb0b
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@sleeptracker-3eb0b.iam.gserviceaccount.com
   ```

#### "Using unspecified index" Warning
**Problem:** Missing database indexes
**Solution:** Apply Firebase rules from `FIREBASE_RULES_AND_INDEXES.md`

### 📱 Client Issues

#### App Won't Start
**Solutions:**
1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

3. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### "Module not found" Errors
**Solutions:**
1. **Check file paths are correct**
2. **Restart development server:**
   ```bash
   cd client
   npm start
   ```

### 🔔 Notification Issues

#### Notifications Not Working
**Solutions:**
1. **Enable browser notifications:**
   - Click the notification icon in address bar
   - Select "Allow" for notifications

2. **Check notification permissions:**
   - Go to browser settings
   - Find site permissions
   - Enable notifications for localhost:3000

3. **HTTPS requirement:**
   - Some browsers require HTTPS for notifications
   - Use `ngrok` or similar for HTTPS testing

### 💾 Data Issues

#### Sleep Data Not Saving
**Solutions:**
1. **Check authentication:**
   - Logout and login again
   - Check JWT token in browser storage

2. **Server connectivity:**
   - Verify server is running
   - Check network status indicator

3. **Firebase connection:**
   - Check Firebase configuration
   - Verify database rules

#### Data Not Loading
**Solutions:**
1. **Clear browser storage:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Check API endpoints:**
   - Open browser dev tools
   - Check Network tab for failed requests

### 🚀 Performance Issues

#### App Running Slowly
**Solutions:**
1. **Close other browser tabs**
2. **Clear browser cache**
3. **Restart browser**
4. **Check system resources**

#### Charts Not Rendering
**Solutions:**
1. **Refresh the page**
2. **Check browser console for errors**
3. **Ensure data is properly formatted**

## Quick Fixes

### 🔄 Universal Solutions
1. **Refresh browser** (Ctrl+R / Cmd+R)
2. **Hard refresh** (Ctrl+Shift+R / Cmd+Shift+R)
3. **Clear cache and reload**
4. **Restart development servers**
5. **Check browser console for errors**

### 🛠️ Development Mode
```bash
# Start everything fresh
./start-app.sh

# Or manually:
# Terminal 1 - Server
cd server && npm start

# Terminal 2 - Client  
cd client && npm start
```

### 📊 Check System Status
```bash
# Check if ports are in use
lsof -i :3000  # Client
lsof -i :5001  # Server

# Check Node.js version
node --version  # Should be 14+ 

# Check npm version
npm --version

# Test server health
curl http://localhost:5001/api/health
```

## Getting Help

### 🐛 Reporting Issues
When reporting issues, include:
1. **Error message** (full text)
2. **Browser console logs**
3. **Steps to reproduce**
4. **Operating system**
5. **Node.js version**
6. **Browser version**

### 📝 Debug Information
```javascript
// Run in browser console for debug info
console.log('User Agent:', navigator.userAgent);
console.log('Local Storage:', localStorage);
console.log('Session Storage:', sessionStorage);
console.log('Online Status:', navigator.onLine);
```

### 🔍 Common Log Messages

#### ✅ Success Messages
- `🚀 Firebase initialized successfully!`
- `Server running on port 5001`
- `✅ Server started successfully`

#### ⚠️ Warning Messages  
- `🔄 Falling back to mock database`
- `⚠️ Network connectivity issue detected`
- `Using unspecified index`

#### ❌ Error Messages
- `ENOTFOUND www.googleapis.com`
- `Cannot access before initialization`
- `Network Error`

## Prevention Tips

### 🛡️ Best Practices
1. **Always start server before client**
2. **Keep dependencies updated**
3. **Use stable internet connection**
4. **Enable browser notifications**
5. **Regularly clear browser cache**

### 🔧 Development Setup
1. **Use latest Node.js LTS version**
2. **Keep npm packages updated**
3. **Configure Firebase properly**
4. **Set up proper environment variables**
5. **Test on multiple browsers**

---

If none of these solutions work, try the nuclear option: delete everything and start fresh! 💥