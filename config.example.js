// Configuration file for API keys
// COPY THIS FILE TO config.js AND ADD YOUR REAL API KEYS
// Never commit config.js with real keys to GitHub!

const CONFIG = {
    // Get your Supabase credentials from: https://supabase.com/dashboard
    // Go to Settings → API
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE', 
    // Example: 'https://abcdefghijklmnop.supabase.co'
    
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
    // Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4ODgwMCwiZXhwIjoxOTU1MTY0ODAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    
    // Get your Groq API key from: https://console.groq.com/keys
    GROQ_API_KEY: 'YOUR_GROQ_API_KEY_HERE'
    // Example: 'gsk_abcdefghijklmnopqrstuvwxyz1234567890'
};

// To use:
// 1. Copy this file to config.js
// 2. Replace all placeholder values with your real API keys
// 3. Make sure config.js is in your .gitignore
