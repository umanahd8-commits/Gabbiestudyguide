# Quick Deployment Checklist

## ✅ Pre-Deployment Checklist

Before deploying to GitHub Pages, make sure you've completed:

### 1. Get API Keys
- [ ] Created Groq account and got API key
- [ ] Created Supabase project and got URL + anon key
- [ ] Saved all keys somewhere safe

### 2. Configure Database
- [ ] Ran SQL schema in Supabase SQL Editor
- [ ] Verified tables were created (topics, scores)
- [ ] Checked RLS policies are enabled

### 3. Update Configuration
- [ ] Copied `config.example.js` to `config.js`
- [ ] Added real Supabase URL to config.js
- [ ] Added real Supabase anon key to config.js
- [ ] Added real Groq API key to config.js

### 4. Update HTML (IMPORTANT!)
- [ ] Added Supabase CDN script to index.html before closing </body>:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script src="app.js"></script>
```

### 5. Test Locally
- [ ] Opened index.html in browser
- [ ] Generated test quiz successfully
- [ ] Took quiz and saw results
- [ ] Checked scores page
- [ ] No console errors (F12)

### 6. Prepare for GitHub
- [ ] Created .gitignore file
- [ ] Decided: Will you commit config.js with keys? (NOT RECOMMENDED)
- [ ] Alternative: Use config.example.js and add keys after deployment

---

## 🚀 Deployment Methods

### Method A: Direct GitHub Upload (Easiest)

1. Create new GitHub repository
2. Make it PUBLIC
3. Upload files:
   - index.html
   - styles.css
   - app.js
   - config.js (with your keys)
   - config.example.js
   - README.md
   - .gitignore
4. Go to Settings → Pages
5. Source: main branch
6. Save and wait 2 minutes
7. Visit: https://yourusername.github.io/repo-name

⚠️ **WARNING:** Your API keys will be visible in public repo!

### Method B: Git Command Line

```bash
# Navigate to your project folder
cd quiz-app

# Initialize git
git init

# Add files
git add .

# First commit
git commit -m "Initial commit: AI Quiz Generator"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/quiz-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in Settings.

### Method C: Deploy Without Exposing Keys (Advanced)

For security, you can:

1. Create repository with config.example.js only
2. Deploy to GitHub Pages
3. After deployment, manually add config.js to deployed site
4. Or use GitHub Secrets + Actions to inject keys at build time

---

## 🧪 Testing After Deployment

Once deployed, test these features:

1. **Generate Quiz:**
   - Select subject: Biology
   - Topic: "Photosynthesis"
   - Difficulty: Medium
   - Click generate
   - Wait 30-60 seconds
   - Should show success message

2. **Take Quiz:**
   - Go to Take Quiz tab
   - Click on your generated quiz
   - Answer some questions
   - Submit quiz
   - Check score displays correctly

3. **View Scores:**
   - Go to View Scores tab
   - Should see your recent attempt
   - Verify percentage is correct

---

## 🐛 Troubleshooting After Deployment

### Issue: "API key not configured" message
**Solution:** 
- Check config.js was uploaded
- Verify keys don't have extra spaces
- Try hard refresh (Ctrl+Shift+R)

### Issue: GitHub Pages shows 404
**Solution:**
- Wait 5 more minutes (Pages takes time)
- Check repository is PUBLIC
- Verify Pages is enabled in Settings
- Make sure index.html is in root folder

### Issue: Quiz generates but doesn't save
**Solution:**
- Check browser console for Supabase errors
- Verify Supabase URL and key are correct
- Check SQL schema was run successfully
- Try opening Supabase dashboard and checking tables

### Issue: Questions are gibberish or poorly formatted
**Solution:**
- This is rare but can happen
- Try regenerating with more specific topic
- Check Groq API status at status.groq.com
- Try different difficulty level

---

## 📊 Monitoring Usage

### Groq API Usage
- Go to console.groq.com
- Check "Usage" section
- Free tier: 30 req/min, 14,400 req/day
- Each quiz generation = 1 request

### Supabase Usage
- Go to supabase.com/dashboard
- Check your project
- Free tier: 500MB database, 2GB bandwidth
- Monitor in Settings → Usage

---

## 🔒 Security Recommendations

### For Personal Use (Low Risk):
- Current setup is fine
- Keep repo private if possible
- Don't share quiz link publicly

### For Public/Production Use (Higher Risk):
- Move API keys to backend
- Use Supabase Edge Functions
- Add user authentication
- Implement rate limiting
- Use Row Level Security

Example: Move to Edge Functions
```javascript
// Supabase Edge Function (generate-quiz)
// This would replace direct Groq API calls from frontend
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { subject, topic, difficulty } = await req.json()
  
  // Call Groq API here with your key (server-side)
  // Return questions to frontend
})
```

---

## 🎯 Next Steps After Deployment

1. **Share your quiz app:**
   - Share link with friends
   - Post on social media
   - Add to portfolio

2. **Customize it:**
   - Change colors in styles.css
   - Add your name/logo
   - Modify subjects list

3. **Add features:**
   - Timer mode
   - Dark mode
   - Export results
   - Leaderboard

4. **Monitor it:**
   - Check for errors weekly
   - Update API keys if needed
   - Backup quiz data periodically

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Review README.md for detailed instructions
3. Check Supabase dashboard for database issues
4. Verify Groq API status
5. Try in incognito mode to rule out cache issues

---

## ✅ Deployment Complete!

Once you see your quiz app working online, you're done! 🎉

Access it at: `https://yourusername.github.io/quiz-app`

Happy quizzing! 📚✨
