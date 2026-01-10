# Y-SAFE Admin Dashboard Guide

## For Client: How to Monitor Users & Progress

### Accessing Admin Dashboard

Your client can access admin dashboard from their phone or any device:

1. **Open Y-SAFE website** (your deployed URL)
   - Example: `https://your-app.onrender.com`

2. **Click on "Admin" button** in the top-right corner
   - It appears next to the logout button on the dashboard

3. **Enter admin password** (set by developer)
   - Default: `admin123` (change this in production!)

4. **OR** access directly at:
   - `https://your-app.onrender.com/admin-login.html`

### What the Admin Dashboard Shows

#### 1. **Overview Statistics**
   - Total users registered
   - Total quizzes taken
   - Lessons completed
   - Average quiz score across all users

#### 2. **Users Tab**
   - List of all registered users
   - User names and sections
   - Type: Registered or Guest
   - Join date
   - **View** button to see detailed user progress

#### 3. **Quiz Results Tab**
   - All quiz attempts
   - User names and scores
   - Quiz type (First Aid, Safety, etc.)
   - Completion date
   - Color-coded scores (green = high, yellow = medium, red = low)

#### 4. **Lessons Tab**
   - All completed lessons
   - User names and sections
   - Lesson completed
   - Completion date

### User Details Modal
When you click "View" on a user:
- Full name and section
- User type (Guest/Registered)
- Join date
- Number of quizzes taken
- Average score
- Number of lessons completed

### Features
- **Real-time data** - Click "Refresh" to get latest data
- **Search** - Filter users by name
- **Mobile-friendly** - Works perfectly on phone browsers
- **Color-coded scores** - Easy to identify performance levels

### Security Note
The admin panel is now **password protected**. Only users with the correct password can access the dashboard.

### Changing Admin Password

**In Render/Railway Environment Variables:**
1. Go to your web service settings
2. Find "Environment Variables"
3. Add or update:
   ```
   Key: ADMIN_PASSWORD
   Value: your-secure-password-here
   ```
4. Save and redeploy

**For Developer (Locally):**
Add to your `.env` file:
```
ADMIN_PASSWORD=your-secure-password-here
```

**Default Password:** `admin123` (⚠️ Change this immediately!)

### Session Timeout
- Admin sessions last **1 day**
- After timeout, you'll need to login again
- Tokens are stored in browser localStorage

### Exporting Data
To export data for reports:
1. Open admin panel on phone
2. Take screenshots of statistics
3. For detailed data: Use desktop browser → Print to PDF
4. Or request developer to add CSV export feature

### Updating Data
- Data refreshes automatically when page loads
- Click "Refresh" button to see latest user activity
- No need to reload the entire page

---

**Access it now:** `https://your-app.onrender.com/admin-login.html`

For technical support or custom features, contact the developer.

---

## Developer Setup Guide

### Environment Variables Needed

Add these to your hosting platform (Render/Railway):

```
JWT_SECRET=your-jwt-secret-key-here
ADMIN_PASSWORD=your-admin-password-here
DATABASE_PATH=/var/data/database.sqlite
```

### How to Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Important Security Notes:
1. **Never commit ADMIN_PASSWORD to GitHub**
2. **Use strong passwords** (minimum 12 characters)
3. **Change default password immediately**
4. **Use different JWT_SECRET for production**
