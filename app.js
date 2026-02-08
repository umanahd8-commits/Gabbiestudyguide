// Initialize Supabase client
let supabase;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeSupabase();
    setupEventListeners();
    loadAvailableQuizzes();
    loadScores();
});

// Initialize Supabase
function initializeSupabase() {
    if (typeof window.supabase === 'undefined') {
        // For development without CDN
        console.log('Supabase SDK not loaded. Using direct API calls.');
        return;
    }
    
    supabase = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
    );
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Generate questions
    document.getElementById('generate-btn').addEventListener('click', generateQuestions);

    // Quiz controls
    document.getElementById('prev-btn').addEventListener('click', previousQuestion);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
    document.getElementById('back-to-selection').addEventListener('click', backToQuizSelection);
    
    // Results actions
    document.getElementById('review-answers').addEventListener('click', reviewAnswers);
    document.getElementById('retake-quiz').addEventListener('click', retakeQuiz);
    document.getElementById('new-quiz').addEventListener('click', () => switchTab('quiz'));
}

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Reload data if needed
    if (tabName === 'quiz') {
        loadAvailableQuizzes();
    } else if (tabName === 'scores') {
        loadScores();
    }
}

// Generate Questions
async function generateQuestions() {
    const subject = document.getElementById('subject').value;
    const topic = document.getElementById('topic').value;
    const difficulty = document.getElementById('difficulty').value;
    const btn = document.getElementById('generate-btn');
    const status = document.getElementById('generate-status');

    if (!subject || !topic) {
        showStatus('Please select a subject and enter a topic', 'error');
        return;
    }

    // Disable button and show loading
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Generating Questions...';
    btn.querySelector('.spinner').style.display = 'inline';
    showStatus('Generating 100 questions... This may take a minute.', 'info');

    try {
        // Call Groq API to generate questions
        const questions = await callGroqAPI(subject, topic, difficulty);
        
        // Save to Supabase
        await saveQuizToDatabase(subject, topic, difficulty, questions);
        
        showStatus(`✅ Successfully generated 100 questions for ${subject}: ${topic}!`, 'success');
        
        // Reload quiz list
        setTimeout(() => {
            loadAvailableQuizzes();
            switchTab('quiz');
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Error generating questions. Please check your API keys and try again.', 'error');
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Generate 100 Questions';
        btn.querySelector('.spinner').style.display = 'none';
    }
}

// Call Groq API
async function callGroqAPI(subject, topic, difficulty) {
    const prompt = `Generate exactly 100 multiple-choice questions about ${topic} in ${subject}. 
    Difficulty level: ${difficulty}.
    
    Format each question as JSON with this structure:
    {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": 0
    }
    
    Where correct_answer is the index (0-3) of the correct option.
    
    Return ONLY a JSON array of 100 questions, nothing else.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert educational content creator. Generate high-quality, accurate multiple-choice questions.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 8000
        })
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    // Validate we have 100 questions
    if (questions.length !== 100) {
        throw new Error(`Expected 100 questions, got ${questions.length}`);
    }
    
    return questions;
}

// Save quiz to database
async function saveQuizToDatabase(subject, topic, difficulty, questions) {
    const quiz = {
        subject: subject,
        topic: topic,
        difficulty: difficulty,
        questions: questions,
        created_at: new Date().toISOString()
    };

    // Store in localStorage (as fallback if Supabase not configured)
    const quizzes = getQuizzesFromStorage();
    quiz.id = Date.now().toString();
    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    // Also try to save to Supabase if configured
    if (supabase) {
        try {
            await supabase.from('topics').insert([quiz]);
        } catch (error) {
            console.log('Supabase not configured, using localStorage only');
        }
    }
}

// Get quizzes from localStorage
function getQuizzesFromStorage() {
    const stored = localStorage.getItem('quizzes');
    return stored ? JSON.parse(stored) : [];
}

// Get scores from localStorage
function getScoresFromStorage() {
    const stored = localStorage.getItem('scores');
    return stored ? JSON.parse(stored) : [];
}

// Load available quizzes
function loadAvailableQuizzes() {
    const container = document.getElementById('available-quizzes');
    const quizzes = getQuizzesFromStorage();

    if (quizzes.length === 0) {
        container.innerHTML = '<p class="loading">No quizzes available. Generate one first!</p>';
        return;
    }

    container.innerHTML = quizzes.map(quiz => `
        <div class="quiz-item" onclick="startQuiz('${quiz.id}')">
            <div class="quiz-info">
                <h3>${quiz.subject}</h3>
                <p>${quiz.topic} - ${quiz.difficulty}</p>
            </div>
            <div class="quiz-meta">
                <div class="question-count">${quiz.questions.length} questions</div>
                <div class="date">${new Date(quiz.created_at).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('');
}

// Quiz state
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// Start quiz
function startQuiz(quizId) {
    const quizzes = getQuizzesFromStorage();
    currentQuiz = quizzes.find(q => q.id === quizId);
    
    if (!currentQuiz) {
        alert('Quiz not found');
        return;
    }

    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);

    document.getElementById('quiz-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-title').textContent = `${currentQuiz.subject}: ${currentQuiz.topic}`;
    
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = currentQuiz.questions.length;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    const letters = ['A', 'B', 'C', 'D'];
    
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <div class="option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" 
             onclick="selectOption(${index})">
            <div class="option-letter">${letters[index]}</div>
            <div class="option-text">${option}</div>
        </div>
    `).join('');
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('submit-btn').style.display = 'inline-flex';
    } else {
        document.getElementById('next-btn').style.display = 'inline-flex';
        document.getElementById('submit-btn').style.display = 'none';
    }
}

// Select option
function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    displayQuestion();
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Submit quiz
function submitQuiz() {
    const unanswered = userAnswers.filter(a => a === null).length;
    
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
            return;
        }
    }
    
    // Calculate score
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correct_answer) {
            correctAnswers++;
        }
    });
    
    const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    
    // Save score
    saveScore(correctAnswers, currentQuiz.questions.length, percentage);
    
    // Show results
    showResults(correctAnswers, currentQuiz.questions.length, percentage);
}

// Save score
function saveScore(correct, total, percentage) {
    const scores = getScoresFromStorage();
    
    const score = {
        id: Date.now().toString(),
        quiz_id: currentQuiz.id,
        subject: currentQuiz.subject,
        topic: currentQuiz.topic,
        correct: correct,
        total: total,
        percentage: percentage,
        date: new Date().toISOString()
    };
    
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
    
    // Also try to save to Supabase if configured
    if (supabase) {
        try {
            supabase.from('scores').insert([score]);
        } catch (error) {
            console.log('Supabase not configured, using localStorage only');
        }
    }
}

// Show results
function showResults(correct, total, percentage) {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('score-value').textContent = correct;
    document.getElementById('score-total').textContent = total;
    
    // Grade message
    const gradeMessage = document.getElementById('grade-message');
    let message = '';
    let gradeClass = '';
    
    if (percentage >= 90) {
        message = '🌟 Excellent! Outstanding performance!';
        gradeClass = 'excellent';
    } else if (percentage >= 70) {
        message = '👍 Good job! Keep up the great work!';
        gradeClass = 'good';
    } else if (percentage >= 50) {
        message = '📚 Fair. Review the material and try again.';
        gradeClass = 'fair';
    } else {
        message = '💪 Keep practicing. You can do better!';
        gradeClass = 'poor';
    }
    
    gradeMessage.textContent = message;
    gradeMessage.className = `grade-message ${gradeClass}`;
}

// Review answers
function reviewAnswers() {
    currentQuestionIndex = 0;
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    // Show answers with correct/incorrect marking
    displayQuestionWithAnswers();
}

// Display question with answers (for review)
function displayQuestionWithAnswers() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestionIndex];
    const correctAnswer = question.correct_answer;
    
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    const letters = ['A', 'B', 'C', 'D'];
    
    optionsContainer.innerHTML = question.options.map((option, index) => {
        let className = 'option';
        if (index === correctAnswer) {
            className += ' correct';
        } else if (index === userAnswer && userAnswer !== correctAnswer) {
            className += ' incorrect';
        }
        
        return `
            <div class="${className}">
                <div class="option-letter">${letters[index]}</div>
                <div class="option-text">${option}</div>
            </div>
        `;
    }).join('');
    
    // Disable option selection during review
    document.querySelectorAll('.option').forEach(opt => {
        opt.style.cursor = 'default';
    });
    
    // Update navigation
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = currentQuestionIndex === currentQuiz.questions.length - 1;
    document.getElementById('submit-btn').style.display = 'none';
}

// Retake quiz
function retakeQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    displayQuestion();
}

// Back to quiz selection
function backToQuizSelection() {
    currentQuiz = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('quiz-selection').style.display = 'block';
    
    loadAvailableQuizzes();
}

// Load scores
function loadScores() {
    const container = document.getElementById('scores-list');
    const scores = getScoresFromStorage().reverse(); // Show newest first
    
    if (scores.length === 0) {
        container.innerHTML = '<p class="loading">No scores yet. Take a quiz first!</p>';
        return;
    }
    
    container.innerHTML = scores.map(score => `
        <div class="score-item">
            <div class="score-item-info">
                <h3>${score.subject}: ${score.topic}</h3>
                <p>${new Date(score.date).toLocaleString()}</p>
            </div>
            <div class="score-item-result">
                <div class="score-value">${score.correct}/${score.total}</div>
                <div class="score-percentage">${score.percentage}%</div>
            </div>
        </div>
    `).join('');
}

// Show status message
function showStatus(message, type) {
    const status = document.getElementById('generate-status');
    status.textContent = message;
    status.className = `status-message ${type}`;
}
