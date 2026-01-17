# Deployment Guide & Troubleshooting

## Quick Deploy to Railway/Render

### Step 1: Deploy
1. Go to [railway.app](https://railway.app) or [render.com](https://render.com)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `Y-Safe` repository
4. Click "Deploy"

### Step 2: Add Environment Variables
After deployment, go to your service settings:

**Railway:** Variables → New Variable
**Render:** Environment → Add Environment Variable

Add these:
```
JWT_SECRET=your-jwt-secret-here
ADMIN_PASSWORD=your-admin-password-here
DATABASE_PATH=/var/data/database.sqlite
```

### Step 3: Redeploy
After adding environment variables, trigger manual redeploy.

---

## Common Issues & Solutions

### Issue 1: "invalid ELF header" Error

**Error Message:**
```
Error: invalid ELF header
```

**Cause:**
sqlite3 compiled for Windows but deploying to Linux

**Solution:** ✅ ALREADY FIXED
- Added `postinstall` script to rebuild sqlite3 automatically
- Delete deployment and redeploy

**If still happens:**
1. In Railway/Render, delete the service
2. Create new deployment
3. Make sure `package.json` has postinstall script

### Issue 2: Database Not Persistent

**Symptoms:**
- User data disappears after restart
- Progress not saving

**Cause:**
Database file not saved to persistent storage

**Solution:**
Set `DATABASE_PATH` environment variable:
```
DATABASE_PATH=/var/data/database.sqlite
```

### Issue 3: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use
```

**Cause:**
Previous node process still running

**Solution (Windows):**
```bash
taskkill //F //IM node.exe
```

**Solution (Mac/Linux):**
```bash
pkill -f node
```

### Issue 4: Admin Login Not Working

**Symptoms:**
- Can't access admin dashboard
- Password not accepted

**Solutions:**

1. **Check environment variables:**
   - Make sure `ADMIN_PASSWORD` is set
   - Default is `admin123`

2. **Clear browser cache:**
   - Open dev tools (F12)
   - Application → Local Storage
   - Delete `admin-token`

3. **Check logs:**
   - Railway: View logs in service page
   - Render: View logs in service page

### Issue 5: 404 Not Found on Routes

**Symptoms:**
- API calls failing
- Pages not loading

**Cause:**
Using `http://localhost:3000` instead of deployed URL

**Solution:**
Update API URLs in your JS files:
- Should be relative: `/api/...`
- Or use `window.location.origin + '/api/...'` (already done ✅)

### Issue 6: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API blocked

**Cause:**
Frontend and backend on different domains

**Solution:**
CORS is already enabled in `server.js`. Make sure:
- Both frontend and backend on same domain
- No proxy interfering

---

## Debugging Tips

### Check Server Logs
**Railway:**
1. Go to your service
2. Click "Logs" tab
3. Look for error messages

**Render:**
1. Go to your service
2. Click "Logs" tab
3. Search for errors (red text)

### Test Locally Before Deploying
```bash
# Start server locally
npm start

# Test in browser
# http://localhost:3000

# Check for errors
```

### View Database Contents
```bash
# Open sqlite3
sqlite3 database.sqlite

# View users
SELECT * FROM users;

# View quiz progress
SELECT * FROM quiz_progress;
```

---

## Railway Specific Settings

### Free Tier Limits
- $5 free credits/month
- Credits reset monthly
- 512MB RAM
- Site stays up within limits

### To Keep Running
- Don't exceed free tier usage
- Monitor credits usage
- Site won't be deleted if credits run out

---

## Render Specific Settings

### Free Tier Behavior
- Site sleeps after 15 minutes of inactivity
- Takes ~30 seconds to wake up on next visit
- Not deleted, just paused

### To Prevent Sleep (Paid)
- Upgrade to paid tier
- Or just accept free tier behavior (acceptable for school project)

---

## Success Indicators

### Deployment Successful When:
✅ Service status shows "Active"
✅ Health check passing (`/health` returns 200)
✅ Can access homepage
✅ Can login
✅ Can submit quizzes
✅ Admin panel accessible

### Quick Test Checklist
1. [ ] Homepage loads
2. [ ] Login works
3. [ ] Dashboard displays
4. [ ] Quizzes work
5. [ ] Admin login works
6. [ ] Admin dashboard loads data
7. [ ] Data persists after refresh

---

## Need Help?

### Check These Files:
1. `package.json` - Dependencies and scripts
2. `server.js` - Backend configuration
3. Environment variables - Set correctly

### Resources:
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [SQLite3 Docs](https://github.com/TryGhost/node-sqlite3)

---

## Final Checklist Before Going Live

- [ ] Code pushed to GitHub
- [ ] All environment variables set
- [ ] Admin password changed from default
- [ ] JWT_SECRET generated and set
- [ ] DATABASE_PATH set for persistence
- [ ] Tested locally
- [ ] Deployed successfully
- [ ] Health check passing
- [ ] All features tested

**Ready for production!** 🚀
