# Y-SAFE Admin Dashboard Guide

## For Client: How to Monitor Users & Progress

### Accessing the Admin Dashboard

Your client can access the admin dashboard from their phone or any device:

1. **Open the Y-SAFE website** (your deployed URL)
   - Example: `https://your-app.onrender.com`

2. **Click on "Admin" button** in the top-right corner
   - It appears next to the logout button on the dashboard

3. **OR** access directly at:
   - `https://your-app.onrender.com/admin.html`

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
Currently, the admin panel is accessible to anyone who knows the URL. For production, you should add password protection.

### To Add Password Protection:
Contact your developer to add authentication to the admin panel.

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

**Access it now:** `https://your-app.onrender.com/admin.html`

For technical support or custom features, contact the developer.
