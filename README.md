# AI Quiz Generator - Setup Guide

A complete quiz generation and testing platform using Groq AI, Supabase, and GitHub Pages.

## 🚀 Features

- Generate 100 AI-powered questions for any topic
- 6 subjects: Mathematics, Civic Education, Biology, Physics, Government, Economics
- Multiple choice questions with instant scoring
- Track all quiz scores
- Review answers after completion
- Completely free hosting

---

## 📋 Prerequisites

You'll need accounts on these free services:
1. **GitHub** - For hosting (github.com)
2. **Supabase** - For database (supabase.com)
3. **Groq** - For AI API (console.groq.com)

---

## 🛠️ Setup Instructions

### Step 1: Create Groq API Account

1. Go to https://console.groq.com
2. Sign up for a free account
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy your API key (save it somewhere safe)

**Free Tier:** 30 requests/minute, 14,400 requests/day

---

### Step 2: Create Supabase Project

1. Go to https://supabase.com
2. Sign up and create a new project
3. Wait for project to initialize (2-3 minutes)
4. Go to **Settings** → **API**
5. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public key** (long string starting with "eyJ...")

---

### Step 3: Setup Supabase Database

1. In your Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy all contents from `supabase-schema.sql`
4. Paste into the SQL editor
5. Click **Run** to create the tables

This creates:
- `topics` table - stores generated quizzes
- `scores` table - stores user results

---

### Step 4: Configure Your Project

1. Open `config.js` file
2. Replace the placeholder values with your actual keys:

```javascript
const CONFIG = {
    SUPABASE_URL: 'https://xxxxx.supabase.co',  // Your Supabase URL
    SUPABASE_ANON_KEY: 'eyJxxxxx...',           // Your Supabase anon key
    GROQ_API_KEY: 'gsk_xxxxx...'                // Your Groq API key
};
```

⚠️ **IMPORTANT:** Never commit your real API keys to a public GitHub repository!

---

### Step 5: Add Supabase SDK

Add this line to your `index.html` file, right before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script src="app.js"></script>
```

---

### Step 6: Deploy to GitHub Pages

#### Option A: Using GitHub Website

1. Create a new repository on GitHub
2. Name it: `quiz-app` (or any name you like)
3. Make it **Public**
4. Upload these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js`
5. Go to **Settings** → **Pages**
6. Under "Source", select **main** branch
7. Click **Save**
8. Wait 1-2 minutes
9. Your site will be live at: `https://yourusername.github.io/quiz-app`

#### Option B: Using Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/quiz-app.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages
# Go to repository Settings → Pages → Select main branch → Save
```

---

## 🎯 How to Use

### Generating Questions

1. Go to "Generate Questions" tab
2. Select a subject (Math, Biology, etc.)
3. Enter a specific topic (e.g., "Quadratic Equations")
4. Choose difficulty level
5. Click "Generate 100 Questions"
6. Wait 30-60 seconds for AI to generate questions

### Taking a Quiz

1. Go to "Take Quiz" tab
2. Click on any available quiz
3. Answer all 100 questions
4. Click "Submit Quiz" when done
5. View your score and grade

### Viewing Scores

1. Go to "View Scores" tab
2. See all your past quiz attempts
3. Scores show percentage and date

---

## 🔧 Troubleshooting

### "API key not configured" error
- Make sure you've replaced placeholder values in `config.js`
- Check that API keys are correct (no extra spaces)

### Questions not generating
- Verify Groq API key is valid
- Check browser console for errors (F12)
- Ensure you haven't exceeded free tier limits

### Quiz not saving
- Verify Supabase credentials are correct
- Check that SQL schema was run successfully
- Open browser console to see specific errors

### GitHub Pages not working
- Wait 2-5 minutes after enabling Pages
- Ensure repository is public
- Check that all files are uploaded correctly

---

## 📊 Database Structure

### Topics Table
```
id          - UUID (auto-generated)
subject     - Text (Mathematics, Biology, etc.)
topic       - Text (user-entered topic)
difficulty  - Text (easy, medium, hard)
questions   - JSONB (array of question objects)
created_at  - Timestamp
```

### Scores Table
```
id          - UUID (auto-generated)
quiz_id     - Text (links to quiz)
subject     - Text
topic       - Text
correct     - Integer (number of correct answers)
total       - Integer (total questions, usually 100)
percentage  - Integer (score percentage)
date        - Timestamp
```

---

## 💡 Tips & Best Practices

1. **API Rate Limits:**
   - Groq free tier: 30 requests/minute
   - Don't generate multiple quizzes simultaneously
   - Wait between generations

2. **Question Quality:**
   - Be specific with topics (good: "Photosynthesis in plants", bad: "Biology")
   - Choose appropriate difficulty for your level
   - Review generated questions for accuracy

3. **Data Storage:**
   - App uses localStorage as backup
   - Data syncs to Supabase when configured
   - Clear browser cache to reset local data

4. **Security:**
   - For production, use environment variables
   - Consider adding user authentication
   - Use Supabase Row Level Security (RLS)

---

## 🔐 Security Considerations (Production)

For a production app, you should:

1. **Never expose API keys in frontend code**
   - Use Supabase Edge Functions instead
   - Move Groq API calls to backend

2. **Add authentication**
   - Enable Supabase Auth
   - Link quizzes to user accounts
   - Use RLS policies (commented in SQL file)

3. **Use environment variables**
   - Create `.env` file (add to .gitignore)
   - Use build tools like Vite or Webpack

---

## 📁 File Structure

```
quiz-app/
├── index.html           # Main HTML file
├── styles.css           # All styling
├── app.js              # Main application logic
├── config.js           # API configuration
├── supabase-schema.sql # Database setup
└── README.md           # This file
```

---

## 🚀 Advanced Features (Future Enhancements)

Want to add more features? Here are ideas:

1. **Timer Mode** - Add countdown timer for quizzes
2. **Leaderboard** - Compare scores with others
3. **Custom Questions** - Let users add their own questions
4. **Export Results** - Download quiz results as PDF
5. **Study Mode** - Show correct answers immediately
6. **Progress Tracking** - Track improvement over time
7. **Share Quizzes** - Share quiz links with friends
8. **Mobile App** - Convert to PWA or React Native

---

## 🐛 Common Issues

**Issue:** "CORS error when calling API"
- **Solution:** Check API key is correct, Groq API doesn't have CORS issues typically

**Issue:** "Questions are low quality"
- **Solution:** Be more specific with topic, try different difficulty levels

**Issue:** "Page not loading on GitHub Pages"
- **Solution:** Ensure repository is public, check Settings → Pages is enabled

**Issue:** "localStorage full"
- **Solution:** Clear browser data, or increase Supabase usage to store online

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12 → Console)
2. Verify all API keys are correct
3. Check Supabase dashboard for errors
4. Review Groq API usage limits

---

## 📄 License

This project is free to use and modify for personal and educational purposes.

---

## 🎉 You're Done!

Your quiz app should now be live and working! 

Access it at: `https://yourusername.github.io/quiz-app`

Enjoy generating and taking quizzes! 🎓
