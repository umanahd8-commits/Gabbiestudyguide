// Configuration file for API keys
// IMPORTANT: Replace these with your actual keys before deploying

const CONFIG = {
    // Get your Supabase credentials from: https://supabase.com/dashboard
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE', // Example: https://xxxxxxxxxxxxx.supabase.co
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
    
    // Get your Groq API key from: https://console.groq.com/keys
    GROQ_API_KEY: 'YOUR_GROQ_API_KEY_HERE'
};

// Validation
if (CONFIG.SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || 
    CONFIG.SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    console.warn('⚠️ Please configure your Supabase credentials in config.js');
}

if (CONFIG.GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    console.warn('⚠️ Please configure your Groq API key in config.js');
}
