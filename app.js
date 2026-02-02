// Language Production Trainer - Main Application

class LanguageTrainer {
    constructor() {
        // State
        this.nativeLang = 'en';
        this.targetLang = 'es';
        this.level = 'B1';
        this.score = 0;
        this.streak = 0;
        this.currentSentence = '';
        this.currentTranslation = '';
        this.currentGrammar = [];
        this.currentGrammarId = null;
        this.hintsUsed = 0;
        this.usedSentences = new Set();

        // Response mode state
        this.questionType = 'translate'; // 'translate' or 'respond'
        this.currentResponses = []; // Multiple acceptable responses for respond mode
        this.currentRespondWith = ''; // The "respond with" hint
        this.currentKeywords = []; // Keywords for partial credit

        // DOM Elements - Setup Screen
        this.setupScreen = document.getElementById('setup-screen');
        this.practiceScreen = document.getElementById('practice-screen');
        this.progressScreen = document.getElementById('progress-screen');
        this.loadingOverlay = document.getElementById('loading-overlay');

        this.nativeLangSelect = document.getElementById('native-lang');
        this.targetLangSelect = document.getElementById('target-lang');
        this.levelSelect = document.getElementById('level');

        // SRS Summary on Setup Screen
        this.srsDueCount = document.getElementById('srs-due-count');
        this.srsMasteredCount = document.getElementById('srs-mastered-count');
        this.srsAccuracy = document.getElementById('srs-accuracy');

        // Practice Screen Elements
        this.sourceSentence = document.getElementById('source-sentence');
        this.sentenceHint = document.getElementById('sentence-hint');
        this.userAnswer = document.getElementById('user-answer');
        this.feedbackSection = document.getElementById('feedback-section');
        this.userAnswerDisplay = document.getElementById('user-answer-display');
        this.correctAnswerDisplay = document.getElementById('correct-answer-display');
        this.diffDisplay = document.getElementById('diff-display');
        this.dictionarySection = document.getElementById('dictionary-section');
        this.dictionaryContent = document.getElementById('dictionary-content');
        this.similarityScore = document.getElementById('similarity-score');

        // Question type elements
        this.questionTypeBadge = document.getElementById('question-type-badge');
        this.respondWithSection = document.getElementById('respond-with-section');
        this.respondWithText = document.getElementById('respond-with-text');
        this.alternativeResponsesSection = document.getElementById('alternative-responses-section');
        this.alternativeResponsesList = document.getElementById('alternative-responses-list');

        // Grammar Info
        this.grammarInfo = document.getElementById('grammar-info');
        this.grammarIcon = document.getElementById('grammar-icon');
        this.grammarName = document.getElementById('grammar-name');
        this.grammarStatus = document.getElementById('grammar-status');
        this.srsFeedback = document.getElementById('srs-feedback');
        this.srsFeedbackText = document.getElementById('srs-feedback-text');

        // Stats Display
        this.scoreDisplay = document.getElementById('score-display');
        this.streakDisplay = document.getElementById('streak-display');
        this.levelDisplay = document.getElementById('level-display');

        // Progress Screen Elements
        this.progressMastered = document.getElementById('progress-mastered');
        this.progressReviewing = document.getElementById('progress-reviewing');
        this.progressLearning = document.getElementById('progress-learning');
        this.progressNew = document.getElementById('progress-new');
        this.progressLevelFilter = document.getElementById('progress-level-filter');
        this.grammarList = document.getElementById('grammar-list');

        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.progressBtn = document.getElementById('progress-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        this.backToSetupBtn = document.getElementById('back-to-setup');
        this.exportDataBtn = document.getElementById('export-data-btn');
        this.resetProgressBtn = document.getElementById('reset-progress-btn');
        this.speakBtn = document.getElementById('speak-btn');

        this.bindEvents();
        this.updateSRSSummary();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startPractice());
        this.progressBtn.addEventListener('click', () => this.showProgressScreen());
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.skipBtn.addEventListener('click', () => this.skipSentence());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.nextBtn.addEventListener('click', () => this.nextSentence());
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.backToSetupBtn.addEventListener('click', () => this.showSetupScreen());
        this.exportDataBtn.addEventListener('click', () => this.exportProgress());
        this.resetProgressBtn.addEventListener('click', () => this.resetProgress());
        if (this.speakBtn) {
            this.speakBtn.addEventListener('click', () => this.speakText());
        }

        // Progress filter
        this.progressLevelFilter.addEventListener('change', () => this.renderGrammarList());

        // Enter key to submit
        this.userAnswer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (this.feedbackSection.classList.contains('hidden')) {
                    this.checkAnswer();
                } else {
                    this.nextSentence();
                }
            }
        });
    }

    // ========================================================================
    // SCREEN NAVIGATION
    // ========================================================================

    showSetupScreen() {
        this.practiceScreen.classList.remove('active');
        this.progressScreen.classList.remove('active');
        this.setupScreen.classList.add('active');
        this.updateSRSSummary();
    }

    showProgressScreen() {
        this.setupScreen.classList.remove('active');
        this.practiceScreen.classList.remove('active');
        this.progressScreen.classList.add('active');
        this.renderProgressScreen();
    }

    showSettings() {
        this.practiceScreen.classList.remove('active');
        this.setupScreen.classList.add('active');
        this.updateSRSSummary();
    }

    // ========================================================================
    // SRS INTEGRATION
    // ========================================================================

    updateSRSSummary() {
        const stats = srs.getOverallStats();
        this.srsDueCount.textContent = stats.dueToday;
        this.srsMasteredCount.textContent = stats.mastered;
        this.srsAccuracy.textContent = `${stats.accuracy}%`;
    }

    updateGrammarInfo() {
        if (!this.currentGrammarId) {
            this.grammarInfo.style.display = 'none';
            return;
        }

        this.grammarInfo.style.display = 'flex';

        const category = grammarCategories[this.currentGrammarId];
        const progress = srs.getGrammarProgress(this.currentGrammarId);

        this.grammarIcon.textContent = srs.getStatusIcon(progress.status);
        this.grammarIcon.style.color = srs.getStatusColor(progress.status);
        this.grammarName.textContent = category?.name || this.currentGrammarId;

        if (progress.nextReview) {
            this.grammarStatus.textContent = srs.formatNextReview(progress.nextReview);
        } else {
            this.grammarStatus.textContent = 'New';
        }
    }

    showSRSFeedback(result) {
        const progress = srs.getGrammarProgress(result.grammarId);
        let message = '';

        if (result.newInterval === 0) {
            message = `Review again soon to reinforce this grammar.`;
        } else if (result.newInterval === 1) {
            message = `Next review: tomorrow`;
        } else {
            message = `Next review: in ${result.newInterval} days`;
        }

        if (progress.status === 'mastered') {
            message = `Mastered! Next review in ${result.newInterval} days.`;
        }

        this.srsFeedbackText.textContent = message;
        this.srsFeedback.style.display = 'block';
    }

    // ========================================================================
    // PRACTICE FLOW
    // ========================================================================

    async startPractice() {
        this.nativeLang = this.nativeLangSelect.value;
        this.targetLang = this.targetLangSelect.value;
        this.level = this.levelSelect.value;

        if (this.nativeLang === this.targetLang) {
            alert('Native and target languages must be different!');
            return;
        }

        this.setupScreen.classList.remove('active');
        this.practiceScreen.classList.add('active');
        this.updateStats();

        await this.loadNewSentence();
    }

    async loadNewSentence() {
        this.showLoading(true);
        this.feedbackSection.classList.add('hidden');
        this.srsFeedback.style.display = 'none';
        this.sentenceHint.textContent = '';
        this.hintsUsed = 0;
        this.userAnswer.value = '';

        // Reset response mode state
        this.currentResponses = [];
        this.currentRespondWith = '';
        this.currentKeywords = [];

        // Hide alternative responses section
        if (this.alternativeResponsesSection) {
            this.alternativeResponsesSection.classList.add('hidden');
        }
        if (this.respondWithSection) {
            this.respondWithSection.classList.add('hidden');
        }

        try {
            // Use SRS to determine which grammar to practice (as a suggestion)
            const nextGrammar = srs.getNextGrammar(this.level);
            let targetGrammar = null;

            if (nextGrammar) {
                targetGrammar = nextGrammar.grammarId;
            } else {
                // No SRS recommendation, pick random grammar for current level
                const levelGrammar = getGrammarCategoriesForLevel(this.level);
                if (levelGrammar.length > 0) {
                    targetGrammar = levelGrammar[Math.floor(Math.random() * levelGrammar.length)].id;
                }
            }

            // Get a question (either translation or conversation response)
            const question = getRandomQuestion(this.level, targetGrammar);
            this.questionType = question.type;
            this.currentGrammar = question.grammar;

            // IMPORTANT: Always set grammar ID from the actual question, not SRS suggestion
            // The question's grammar array contains what we're actually practicing
            if (this.currentGrammar && this.currentGrammar.length > 0) {
                this.currentGrammarId = this.currentGrammar[0];
            } else {
                this.currentGrammarId = targetGrammar;
            }

            // Update question type badge
            this.updateQuestionTypeBadge();

            if (question.type === 'respond') {
                // Handle conversation response mode
                await this.loadRespondQuestion(question);
            } else {
                // Handle translation mode (existing logic)
                await this.loadTranslateQuestion(question, targetGrammar);
            }

            this.updateGrammarInfo();

        } catch (error) {
            console.error('Error loading sentence:', error);
            this.sourceSentence.textContent = 'Error loading sentence. Please try again.';
        }

        this.showLoading(false);
        this.userAnswer.focus();
    }

    updateQuestionTypeBadge() {
        if (!this.questionTypeBadge) return;

        if (this.questionType === 'respond') {
            this.questionTypeBadge.textContent = 'RESPOND';
            this.questionTypeBadge.className = 'question-type-badge respond';
            this.questionTypeBadge.title = 'Respond to the prompt in your target language';
        } else {
            this.questionTypeBadge.textContent = 'TRANSLATE';
            this.questionTypeBadge.className = 'question-type-badge translate';
            this.questionTypeBadge.title = 'Translate this sentence to your target language';
        }
    }

    async loadRespondQuestion(question) {
        // Store response data
        this.currentRespondWith = question.respondWith;
        this.currentKeywords = question.keywords || [];

        // The prompt is in English, translate to target language
        const promptInTarget = this.targetLang === 'en'
            ? question.prompt
            : await this.translate(question.prompt, 'en', this.targetLang);

        this.currentSentence = promptInTarget;
        this.sourceSentence.textContent = promptInTarget;

        // Translate all acceptable responses to target language
        this.currentResponses = [];
        for (const response of question.responses) {
            if (this.targetLang === 'en') {
                this.currentResponses.push(response);
            } else {
                const translated = await this.translate(response, 'en', this.targetLang);
                this.currentResponses.push(translated);
            }
        }

        // Set the first response as the "main" translation for comparison
        this.currentTranslation = this.currentResponses[0] || '';
    }

    async loadTranslateQuestion(question, targetGrammar) {
        let englishSentence = question.sentence;

        // Avoid repeating recent sentences
        let attempts = 0;
        while (this.usedSentences.has(englishSentence) && attempts < 10) {
            const newQuestion = getRandomQuestion(this.level, targetGrammar);
            if (newQuestion.type === 'translate') {
                englishSentence = newQuestion.sentence;
                this.currentGrammar = newQuestion.grammar;
            }
            attempts++;
        }
        this.usedSentences.add(englishSentence);

        // Clear history if too large
        if (this.usedSentences.size > 50) {
            this.usedSentences.clear();
        }

        // If native language is English, show English sentence directly
        if (this.nativeLang === 'en') {
            this.currentSentence = englishSentence;
        } else {
            // Translate English sentence to native language
            this.currentSentence = await this.translate(englishSentence, 'en', this.nativeLang);
        }

        // Get the target language translation (this is what we'll compare against)
        if (this.targetLang === 'en') {
            this.currentTranslation = englishSentence;
        } else {
            this.currentTranslation = await this.translate(englishSentence, 'en', this.targetLang);
        }

        this.sourceSentence.textContent = this.currentSentence;
    }

    async translate(text, fromLang, toLang) {
        // Using MyMemory Translation API (free, no key required)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.responseStatus === 200 && data.responseData) {
                return data.responseData.translatedText;
            } else {
                throw new Error(data.responseDetails || 'Translation failed');
            }
        } catch (error) {
            console.error('Translation error:', error);
            // Fallback: return original text with a note
            return `[Translation unavailable] ${text}`;
        }
    }

    async checkAnswer() {
        const userText = this.userAnswer.value.trim();

        if (!userText) {
            alert('Please enter your response');
            return;
        }

        this.showLoading(true);

        try {
            // Display user's answer
            this.userAnswerDisplay.textContent = userText;

            let similarity;
            let bestMatch = this.currentTranslation;

            if (this.questionType === 'respond' && this.currentResponses.length > 0) {
                // For respond mode, compare against all acceptable responses
                // Find the best match
                let bestSimilarity = 0;

                for (const response of this.currentResponses) {
                    const sim = this.calculateSimilarity(userText, response);
                    if (sim > bestSimilarity) {
                        bestSimilarity = sim;
                        bestMatch = response;
                    }
                }

                // Also give partial credit for keywords
                const keywordBonus = this.calculateKeywordBonus(userText);
                similarity = Math.min(100, bestSimilarity + keywordBonus);

                // Show the best matching response
                this.correctAnswerDisplay.textContent = bestMatch;

                // Show all acceptable responses and the "respond with" hint
                this.showAlternativeResponses();
            } else {
                // Standard translation mode
                similarity = this.calculateSimilarity(userText, this.currentTranslation);
                this.correctAnswerDisplay.textContent = this.currentTranslation;
            }

            // Create diff against the best match
            this.displayDiff(userText, bestMatch);
            this.displayScore(similarity);

            // Update SRS for all grammar categories in this sentence
            if (this.currentGrammarId) {
                const quality = srs.similarityToQuality(similarity);
                const result = srs.processReview(this.currentGrammarId, quality);
                this.showSRSFeedback(result);
            }

            // Update stats
            if (similarity >= 80) {
                this.score += Math.round(similarity / 10) - this.hintsUsed;
                this.streak++;
            } else {
                this.streak = 0;
            }
            this.updateStats();

            this.feedbackSection.classList.remove('hidden');
            this.dictionarySection.classList.add('hidden');

        } catch (error) {
            console.error('Error checking answer:', error);
        }

        this.showLoading(false);
    }

    calculateKeywordBonus(userText) {
        if (!this.currentKeywords || this.currentKeywords.length === 0) {
            return 0;
        }

        const normalizedUser = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let matchedKeywords = 0;

        for (const keyword of this.currentKeywords) {
            const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalizedUser.includes(normalizedKeyword)) {
                matchedKeywords++;
            }
        }

        // Give up to 10% bonus for keyword matches
        const keywordRatio = matchedKeywords / this.currentKeywords.length;
        return Math.round(keywordRatio * 10);
    }

    showAlternativeResponses() {
        // Show the "respond with" section
        if (this.respondWithSection && this.currentRespondWith) {
            this.respondWithSection.classList.remove('hidden');
            if (this.respondWithText) {
                this.respondWithText.textContent = this.currentRespondWith;
            }
        }

        // Show alternative responses
        if (this.alternativeResponsesSection && this.currentResponses.length > 1) {
            this.alternativeResponsesSection.classList.remove('hidden');
            if (this.alternativeResponsesList) {
                this.alternativeResponsesList.innerHTML = '';
                for (const response of this.currentResponses) {
                    const li = document.createElement('li');
                    li.textContent = response;
                    this.alternativeResponsesList.appendChild(li);
                }
            }
        }
    }

    calculateSimilarity(text1, text2) {
        // Normalize texts
        const normalize = (text) => text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s']/g, '') // Remove punctuation except apostrophe
            .trim();

        const s1 = normalize(text1);
        const s2 = normalize(text2);

        if (s1 === s2) return 100;

        // Use language-aware tokenization for word-based similarity
        const words1 = this.tokenizeText(text1, this.targetLang).map(w =>
            w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );
        const words2 = this.tokenizeText(text2, this.targetLang).map(w =>
            w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        );

        let matches = 0;
        const used = new Set();

        for (const word of words1) {
            for (let i = 0; i < words2.length; i++) {
                if (!used.has(i) && (word === words2[i] || this.levenshteinDistance(word, words2[i]) <= 1)) {
                    matches++;
                    used.add(i);
                    break;
                }
            }
        }

        const maxLen = Math.max(words1.length, words2.length);
        return Math.round((matches / maxLen) * 100);
    }

    levenshteinDistance(s1, s2) {
        const m = s1.length;
        const n = s2.length;
        const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
                }
            }
        }

        return dp[m][n];
    }

    // Language-aware tokenization that handles contractions and apostrophes properly
    tokenizeText(text, lang) {
        // Languages where apostrophe is part of the word (contractions/elisions)
        const apostropheLanguages = ['it', 'fr', 'ca']; // Italian, French, Catalan

        // Languages where apostrophe typically separates words or marks possession
        const apostropheSeparatorLanguages = ['en'];

        // Normalize the text first
        let normalized = text.trim();

        if (apostropheLanguages.includes(lang)) {
            // For Italian, French, etc.: "l'acqua" stays as "l'acqua" (one token)
            // But we still want to split on spaces
            // Also handle curly apostrophes
            normalized = normalized.replace(/['']/g, "'");

            // Split on whitespace and punctuation, but keep apostrophe with word
            // This regex splits on whitespace and sentence-ending punctuation, but not apostrophes
            const tokens = normalized.match(/[\w']+|[^\s\w']+/gi) || [];

            // Filter out pure punctuation tokens and empty strings
            return tokens.filter(t => /[\w']/.test(t));
        } else if (apostropheSeparatorLanguages.includes(lang)) {
            // For English: "don't" stays together, but "'s" stays with the word
            normalized = normalized.replace(/['']/g, "'");
            const tokens = normalized.match(/[\w']+/gi) || [];
            return tokens.filter(t => t.length > 0);
        } else {
            // Default: split on whitespace and non-word characters
            // Keep words with common diacritics together
            const tokens = normalized.match(/[\w\u00C0-\u024F]+/gi) || [];
            return tokens;
        }
    }

    displayDiff(userText, correctText) {
        const normalize = (text) => text.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Use language-aware tokenization
        const userWords = this.tokenizeText(userText, this.targetLang);
        const correctWords = this.tokenizeText(correctText, this.targetLang);

        const userNorm = userWords.map(w => normalize(w.replace(/[^\w]/g, '')));
        const correctNorm = correctWords.map(w => normalize(w.replace(/[^\w]/g, '')));

        this.diffDisplay.innerHTML = '';

        // Add legend
        const legend = document.createElement('div');
        legend.className = 'word-legend';
        legend.innerHTML = `
            <div class="legend-item"><span class="legend-dot match"></span> Correct</div>
            <div class="legend-item"><span class="legend-dot different"></span> Close</div>
            <div class="legend-item"><span class="legend-dot extra"></span> Extra word</div>
            <div class="legend-item"><span class="legend-dot missing"></span> Missing</div>
        `;

        // Create word comparison
        const wordsDiv = document.createElement('div');
        wordsDiv.style.marginBottom = '15px';

        // Track which correct words have been matched
        const matchedCorrect = new Set();

        // Check user words
        for (let i = 0; i < userWords.length; i++) {
            const word = userWords[i];
            const wordNorm = userNorm[i];

            const span = document.createElement('span');
            span.className = 'word-token';
            span.textContent = word;
            span.addEventListener('click', () => this.lookupWord(word));

            // Check if exact match
            let foundExact = -1;
            for (let j = 0; j < correctNorm.length; j++) {
                if (!matchedCorrect.has(j) && wordNorm === correctNorm[j]) {
                    foundExact = j;
                    break;
                }
            }

            if (foundExact >= 0) {
                span.classList.add('match');
                matchedCorrect.add(foundExact);
            } else {
                // Check for close match (Levenshtein distance 1-2)
                let foundClose = -1;
                for (let j = 0; j < correctNorm.length; j++) {
                    if (!matchedCorrect.has(j) && this.levenshteinDistance(wordNorm, correctNorm[j]) <= 2) {
                        foundClose = j;
                        break;
                    }
                }

                if (foundClose >= 0) {
                    span.classList.add('different');
                    span.title = `Similar to: ${correctWords[foundClose]}`;
                    matchedCorrect.add(foundClose);
                } else {
                    span.classList.add('extra');
                    span.title = 'Not in reference translation';
                }
            }

            wordsDiv.appendChild(span);
            wordsDiv.appendChild(document.createTextNode(' '));
        }

        // Add missing words from correct answer
        const missingDiv = document.createElement('div');
        missingDiv.style.marginTop = '10px';

        let hasMissing = false;
        for (let j = 0; j < correctWords.length; j++) {
            if (!matchedCorrect.has(j)) {
                hasMissing = true;
                const span = document.createElement('span');
                span.className = 'word-token missing';
                span.textContent = correctWords[j];
                span.title = 'Missing from your answer';
                span.addEventListener('click', () => this.lookupWord(correctWords[j]));
                missingDiv.appendChild(span);
                missingDiv.appendChild(document.createTextNode(' '));
            }
        }

        if (hasMissing) {
            const label = document.createElement('div');
            label.style.color = '#90a4ae';
            label.style.fontSize = '0.85rem';
            label.style.marginTop = '15px';
            label.style.marginBottom = '5px';
            label.textContent = 'Missing words:';
            this.diffDisplay.appendChild(label);
        }

        this.diffDisplay.appendChild(wordsDiv);
        if (hasMissing) {
            this.diffDisplay.appendChild(missingDiv);
        }
        this.diffDisplay.appendChild(legend);
    }

    displayScore(similarity) {
        let scoreClass, message;

        if (similarity >= 90) {
            scoreClass = 'score-excellent';
            message = 'Excellent!';
        } else if (similarity >= 70) {
            scoreClass = 'score-good';
            message = 'Good job!';
        } else if (similarity >= 50) {
            scoreClass = 'score-fair';
            message = 'Keep practicing!';
        } else {
            scoreClass = 'score-poor';
            message = 'Review and try again';
        }

        this.similarityScore.className = scoreClass;
        this.similarityScore.textContent = `${message} (${similarity}% match)`;
    }

    async lookupWord(word) {
        this.dictionarySection.classList.remove('hidden');
        this.dictionaryContent.innerHTML = '<p>Loading definition...</p>';

        // Clean the word but preserve apostrophes for languages that use them
        const cleanWord = word.replace(/[^\w\u00C0-\u024F']/g, '').toLowerCase();

        try {
            // Try multiple sources for better dictionary coverage
            const result = await this.getDictionaryEntry(cleanWord);
            this.displayEnhancedDictionary(result);
        } catch (error) {
            console.error('Dictionary lookup error:', error);
            await this.lookupWithTranslation(cleanWord);
        }
    }

    async getDictionaryEntry(word) {
        const result = {
            word: word,
            translations: [],
            definitions: [],
            partOfSpeech: null,
            conjugations: null,
            examples: [],
            relatedForms: []
        };

        // Strategy 1: Try FreeDictionaryAPI for supported languages (mainly English)
        if (this.targetLang === 'en') {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data[0]) {
                        const entry = data[0];
                        result.phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text;
                        if (entry.meanings) {
                            for (const meaning of entry.meanings) {
                                result.partOfSpeech = result.partOfSpeech || meaning.partOfSpeech;
                                for (const def of meaning.definitions.slice(0, 2)) {
                                    result.definitions.push({
                                        pos: meaning.partOfSpeech,
                                        definition: def.definition,
                                        example: def.example
                                    });
                                }
                                if (meaning.synonyms) {
                                    result.relatedForms.push(...meaning.synonyms.slice(0, 3));
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log('FreeDictionaryAPI failed:', e);
            }
        }

        // Strategy 2: Use MyMemory for translation to native language
        try {
            const translation = await this.translate(word, this.targetLang, this.nativeLang);
            if (translation && !translation.includes('[Translation unavailable]')) {
                result.translations.push({
                    lang: this.nativeLang,
                    text: translation
                });
            }
        } catch (e) {
            console.log('Translation failed:', e);
        }

        // Strategy 3: If target is not English, also get English translation for reference
        if (this.targetLang !== 'en' && this.nativeLang !== 'en') {
            try {
                const englishTranslation = await this.translate(word, this.targetLang, 'en');
                if (englishTranslation && !englishTranslation.includes('[Translation unavailable]')) {
                    result.translations.push({
                        lang: 'en',
                        text: englishTranslation
                    });
                }
            } catch (e) {
                console.log('English translation failed:', e);
            }
        }

        // Strategy 4: Try to detect verb forms and provide conjugation info
        result.conjugations = this.getConjugationInfo(word, this.targetLang);

        return result;
    }

    // Basic conjugation pattern detection for common languages
    getConjugationInfo(word, lang) {
        const conjugationPatterns = {
            'es': { // Spanish
                verbEndings: {
                    '-ar': { infinitive: '-ar', present: ['-o', '-as', '-a', '-amos', '-áis', '-an'], past: ['-é', '-aste', '-ó', '-amos', '-asteis', '-aron'] },
                    '-er': { infinitive: '-er', present: ['-o', '-es', '-e', '-emos', '-éis', '-en'], past: ['-í', '-iste', '-ió', '-imos', '-isteis', '-ieron'] },
                    '-ir': { infinitive: '-ir', present: ['-o', '-es', '-e', '-imos', '-ís', '-en'], past: ['-í', '-iste', '-ió', '-imos', '-isteis', '-ieron'] }
                },
                detectForm: (w) => {
                    const forms = [];
                    // Check for common conjugated endings
                    if (w.endsWith('ando') || w.endsWith('iendo')) forms.push('gerund (present participle)');
                    if (w.endsWith('ado') || w.endsWith('ido')) forms.push('past participle');
                    if (w.match(/[aei]r$/)) forms.push('infinitive');
                    if (w.match(/[oaeo]$/)) forms.push('possibly conjugated verb');
                    return forms;
                }
            },
            'fr': { // French
                verbEndings: {
                    '-er': { infinitive: '-er', present: ['-e', '-es', '-e', '-ons', '-ez', '-ent'] },
                    '-ir': { infinitive: '-ir', present: ['-is', '-is', '-it', '-issons', '-issez', '-issent'] },
                    '-re': { infinitive: '-re', present: ['-s', '-s', '-', '-ons', '-ez', '-ent'] }
                },
                detectForm: (w) => {
                    const forms = [];
                    if (w.endsWith('ant')) forms.push('present participle');
                    if (w.endsWith('é') || w.endsWith('i') || w.endsWith('u')) forms.push('possibly past participle');
                    if (w.match(/[ei]r$/)) forms.push('infinitive');
                    return forms;
                }
            },
            'it': { // Italian
                verbEndings: {
                    '-are': { infinitive: '-are', present: ['-o', '-i', '-a', '-iamo', '-ate', '-ano'] },
                    '-ere': { infinitive: '-ere', present: ['-o', '-i', '-e', '-iamo', '-ete', '-ono'] },
                    '-ire': { infinitive: '-ire', present: ['-o/-isco', '-i/-isci', '-e/-isce', '-iamo', '-ite', '-ono/-iscono'] }
                },
                detectForm: (w) => {
                    const forms = [];
                    if (w.endsWith('ando') || w.endsWith('endo')) forms.push('gerund');
                    if (w.endsWith('ato') || w.endsWith('uto') || w.endsWith('ito')) forms.push('past participle');
                    if (w.match(/[ai]re$/)) forms.push('infinitive');
                    // Handle elisions like l'acqua
                    if (w.includes("'")) forms.push('elided article/pronoun');
                    return forms;
                }
            },
            'de': { // German
                detectForm: (w) => {
                    const forms = [];
                    if (w.endsWith('en')) forms.push('infinitive or plural');
                    if (w.endsWith('t')) forms.push('possibly 3rd person or past participle');
                    if (w.endsWith('e')) forms.push('possibly 1st person singular');
                    return forms;
                }
            },
            'pt': { // Portuguese
                verbEndings: {
                    '-ar': { infinitive: '-ar', present: ['-o', '-as', '-a', '-amos', '-ais', '-am'] },
                    '-er': { infinitive: '-er', present: ['-o', '-es', '-e', '-emos', '-eis', '-em'] },
                    '-ir': { infinitive: '-ir', present: ['-o', '-es', '-e', '-imos', '-is', '-em'] }
                },
                detectForm: (w) => {
                    const forms = [];
                    if (w.endsWith('ando') || w.endsWith('endo') || w.endsWith('indo')) forms.push('gerund');
                    if (w.endsWith('ado') || w.endsWith('ido')) forms.push('past participle');
                    if (w.match(/[aei]r$/)) forms.push('infinitive');
                    return forms;
                }
            }
        };

        const langPattern = conjugationPatterns[lang];
        if (!langPattern) return null;

        const detected = langPattern.detectForm ? langPattern.detectForm(word) : [];
        const verbEndings = langPattern.verbEndings || {};

        return {
            detectedForms: detected,
            verbPatterns: verbEndings,
            hasConjugationInfo: detected.length > 0 || Object.keys(verbEndings).length > 0
        };
    }

    displayEnhancedDictionary(data) {
        let html = `<div class="dict-word">${data.word}</div>`;

        if (data.phonetic) {
            html += `<div class="dict-phonetic">${data.phonetic}</div>`;
        }

        // Show translations
        if (data.translations.length > 0) {
            html += `<div class="dict-meaning">`;
            html += `<div class="dict-pos">Translations</div>`;
            for (const trans of data.translations) {
                const langName = this.getLanguageName(trans.lang);
                html += `<div class="dict-definition"><strong>${langName}:</strong> ${trans.text}</div>`;
            }
            html += `</div>`;
        }

        // Show definitions if available
        if (data.definitions.length > 0) {
            html += `<div class="dict-meaning">`;
            html += `<div class="dict-pos">Definitions</div>`;
            for (const def of data.definitions) {
                html += `<div class="dict-definition">`;
                if (def.pos) html += `<em>(${def.pos})</em> `;
                html += def.definition;
                html += `</div>`;
                if (def.example) {
                    html += `<div class="dict-example">"${def.example}"</div>`;
                }
            }
            html += `</div>`;
        }

        // Show conjugation info
        if (data.conjugations && data.conjugations.hasConjugationInfo) {
            html += `<div class="dict-conjugation">`;
            html += `<div class="dict-pos">Grammar Info</div>`;

            if (data.conjugations.detectedForms.length > 0) {
                html += `<div class="dict-definition"><strong>Detected form:</strong> ${data.conjugations.detectedForms.join(', ')}</div>`;
            }

            // Show verb conjugation patterns for the language
            if (Object.keys(data.conjugations.verbPatterns).length > 0) {
                html += `<div class="dict-verb-patterns">`;
                html += `<div class="dict-definition" style="margin-top: 10px;"><strong>Common verb patterns in ${this.getLanguageName(this.targetLang)}:</strong></div>`;
                for (const [ending, pattern] of Object.entries(data.conjugations.verbPatterns)) {
                    html += `<div class="verb-pattern-item">`;
                    html += `<span class="verb-ending">${ending} verbs:</span> `;
                    if (pattern.present) {
                        html += `<span class="verb-forms">Present: ${pattern.present.slice(0, 3).join(', ')}...</span>`;
                    }
                    html += `</div>`;
                }
                html += `</div>`;
            }

            html += `</div>`;
        }

        // Show related forms
        if (data.relatedForms.length > 0) {
            html += `<div class="dict-forms"><div class="dict-pos">Related Words</div>`;
            for (const form of data.relatedForms) {
                html += `<span class="form-item"><span class="form-word">${form}</span></span>`;
            }
            html += `</div>`;
        }

        // Show help message if limited info
        if (data.translations.length === 0 && data.definitions.length === 0) {
            html += `<p style="color: #f44336; margin-top: 15px;">Could not find detailed information for this word.</p>`;
        }

        this.dictionaryContent.innerHTML = html;
    }

    getLanguageName(code) {
        const names = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese',
            'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'nl': 'Dutch',
            'pl': 'Polish', 'sv': 'Swedish', 'tr': 'Turkish', 'hi': 'Hindi',
            'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian', 'cs': 'Czech',
            'da': 'Danish', 'fi': 'Finnish', 'el': 'Greek', 'he': 'Hebrew',
            'hu': 'Hungarian', 'no': 'Norwegian', 'ro': 'Romanian', 'sk': 'Slovak',
            'uk': 'Ukrainian', 'bg': 'Bulgarian', 'hr': 'Croatian', 'ca': 'Catalan',
            'et': 'Estonian', 'lv': 'Latvian', 'lt': 'Lithuanian', 'sl': 'Slovenian',
            'mt': 'Maltese', 'sq': 'Albanian', 'mk': 'Macedonian', 'sr': 'Serbian',
            'bs': 'Bosnian', 'is': 'Icelandic', 'ga': 'Irish', 'cy': 'Welsh',
            'gl': 'Galician', 'eu': 'Basque', 'af': 'Afrikaans', 'sw': 'Swahili',
            'ms': 'Malay', 'tl': 'Filipino', 'bn': 'Bengali', 'ta': 'Tamil',
            'te': 'Telugu', 'mr': 'Marathi', 'ur': 'Urdu', 'fa': 'Persian'
        };
        return names[code] || code.toUpperCase();
    }

    async lookupWithTranslation(word) {
        try {
            // Translate the word to the native language
            const translation = await this.translate(word, this.targetLang, this.nativeLang);

            this.dictionaryContent.innerHTML = `
                <div class="dict-word">${word}</div>
                <div class="dict-meaning">
                    <div class="dict-pos">Translation</div>
                    <div class="dict-definition">${translation}</div>
                </div>
                <p style="color: #90a4ae; font-size: 0.85rem; margin-top: 15px;">
                    Detailed dictionary not available for this language. Showing translation.
                </p>
            `;
        } catch (error) {
            this.dictionaryContent.innerHTML = `
                <div class="dict-word">${word}</div>
                <p style="color: #f44336;">Could not find definition for this word.</p>
            `;
        }
    }

    async showHint() {
        this.hintsUsed++;

        if (this.questionType === 'respond' && this.currentRespondWith) {
            // For respond mode: 3-stage hint system
            if (this.hintsUsed === 1) {
                // Stage 1: Show the "respond with" instruction
                this.sentenceHint.textContent = `Respond with: "${this.currentRespondWith}"`;
            } else if (this.hintsUsed === 2) {
                // Stage 2: Show native language translation of an acceptable response
                this.sentenceHint.textContent = 'Translating example response...';
                try {
                    const nativeTranslation = await this.translate(
                        this.currentTranslation,
                        this.targetLang,
                        this.nativeLang
                    );
                    this.sentenceHint.textContent = `Example in ${this.getLanguageName(this.nativeLang)}: "${nativeTranslation}"`;
                } catch (error) {
                    // Fallback if translation fails
                    this.sentenceHint.textContent = `Example: "${this.currentRespondWith}"`;
                }
            } else {
                // Stage 3+: Show parts of the target language response
                const words = this.currentTranslation.split(/\s+/);
                const hintWords = Math.min(this.hintsUsed - 2, Math.ceil(words.length / 2));
                const hint = words.slice(0, hintWords).join(' ') + '...';
                this.sentenceHint.textContent = `In ${this.getLanguageName(this.targetLang)}: "${hint}"`;
            }
        } else {
            // Standard translation hint - show first few words
            const words = this.currentTranslation.split(/\s+/);
            const hintWords = Math.min(this.hintsUsed, Math.ceil(words.length / 2));
            const hint = words.slice(0, hintWords).join(' ') + '...';
            this.sentenceHint.textContent = `Hint: "${hint}"`;
        }
    }

    speakText() {
        // Use Web Speech API (built into browsers, free, works offline)
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in your browser.');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Determine what text to speak based on question type
        let textToSpeak = '';
        let langCode = '';

        if (this.questionType === 'respond') {
            // For respond questions, speak the prompt in the target language
            textToSpeak = this.currentSentence;
            langCode = this.targetLang;
        } else {
            // For translate questions, speak the source sentence in native language
            textToSpeak = this.currentSentence;
            langCode = this.nativeLang;
        }

        if (!textToSpeak) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Map language codes to BCP 47 language tags for speech synthesis
        const langMap = {
            'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE',
            'it': 'it-IT', 'pt': 'pt-PT', 'zh': 'zh-CN', 'ja': 'ja-JP',
            'ko': 'ko-KR', 'ru': 'ru-RU', 'ar': 'ar-SA', 'nl': 'nl-NL',
            'pl': 'pl-PL', 'sv': 'sv-SE', 'da': 'da-DK', 'no': 'nb-NO',
            'fi': 'fi-FI', 'el': 'el-GR', 'cs': 'cs-CZ', 'hu': 'hu-HU',
            'ro': 'ro-RO', 'sk': 'sk-SK', 'bg': 'bg-BG', 'hr': 'hr-HR',
            'sl': 'sl-SI', 'et': 'et-EE', 'lv': 'lv-LV', 'lt': 'lt-LT',
            'uk': 'uk-UA', 'sr': 'sr-RS', 'ca': 'ca-ES', 'hi': 'hi-IN',
            'bn': 'bn-IN', 'th': 'th-TH', 'vi': 'vi-VN', 'id': 'id-ID',
            'ms': 'ms-MY', 'tl': 'fil-PH', 'ta': 'ta-IN', 'te': 'te-IN',
            'tr': 'tr-TR', 'he': 'he-IL', 'fa': 'fa-IR', 'af': 'af-ZA',
            'sw': 'sw-KE'
        };

        utterance.lang = langMap[langCode] || langCode;
        utterance.rate = 0.9; // Slightly slower for language learning

        // Try to find a voice that matches the language
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang.startsWith(utterance.lang.split('-')[0]));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    skipSentence() {
        this.streak = 0;
        this.updateStats();
        this.loadNewSentence();
    }

    nextSentence() {
        this.loadNewSentence();
    }

    updateStats() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        this.streakDisplay.textContent = `Streak: ${this.streak}`;
        this.levelDisplay.textContent = `Level: ${this.level}`;
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    // ========================================================================
    // PROGRESS SCREEN
    // ========================================================================

    renderProgressScreen() {
        const stats = srs.getOverallStats();

        this.progressMastered.textContent = stats.mastered;
        this.progressReviewing.textContent = stats.reviewing;
        this.progressLearning.textContent = stats.learning;
        this.progressNew.textContent = Object.keys(grammarCategories).length - stats.totalGrammar + stats.new;

        this.renderGrammarList();
    }

    renderGrammarList() {
        const filterLevel = this.progressLevelFilter.value;
        let grammarStats;

        if (filterLevel === 'all') {
            grammarStats = srs.getAllGrammarStats();
        } else {
            grammarStats = srs.getAllGrammarStats(filterLevel);
        }

        // Sort by status priority then by name
        const statusOrder = { 'learning': 0, 'reviewing': 1, 'new': 2, 'mastered': 3 };
        grammarStats.sort((a, b) => {
            const statusDiff = statusOrder[a.status] - statusOrder[b.status];
            if (statusDiff !== 0) return statusDiff;
            return a.name.localeCompare(b.name);
        });

        this.grammarList.innerHTML = '';

        for (const stat of grammarStats) {
            const item = document.createElement('div');
            item.className = 'grammar-item';
            item.innerHTML = `
                <div class="grammar-item-left">
                    <span class="grammar-item-icon" style="color: ${srs.getStatusColor(stat.status)}">
                        ${srs.getStatusIcon(stat.status)}
                    </span>
                    <div class="grammar-item-info">
                        <h4>${stat.name}</h4>
                        <p>${stat.description}</p>
                    </div>
                </div>
                <div class="grammar-item-right">
                    <span class="grammar-item-level">${stat.level}</span>
                    <div class="grammar-item-next">${srs.formatNextReview(stat.nextReview)}</div>
                    ${stat.totalAttempts > 0 ? `<div class="grammar-item-accuracy">${stat.accuracy}% accuracy</div>` : ''}
                </div>
            `;
            this.grammarList.appendChild(item);
        }

        if (grammarStats.length === 0) {
            this.grammarList.innerHTML = '<p style="text-align: center; color: #90a4ae; padding: 20px;">No grammar categories for this level.</p>';
        }
    }

    exportProgress() {
        const data = srs.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'language-trainer-progress.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            srs.resetProgress();
            this.renderProgressScreen();
            this.updateSRSSummary();
            alert('Progress has been reset.');
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LanguageTrainer();
});
