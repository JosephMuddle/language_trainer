// Spaced Repetition System (SRS) for Language Production Trainer
// Implements SM-2 algorithm variant for grammar category review scheduling

class SpacedRepetitionSystem {
    constructor() {
        this.storageKey = 'languageTrainer_srs';
        this.data = this.load();
        this.recentGrammar = []; // Track recent grammar to ensure variety
        this.maxConsecutiveSame = 2; // Max times same grammar can appear consecutively
    }

    // ========================================================================
    // STORAGE
    // ========================================================================

    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert date strings back to Date objects
                for (const key in parsed.grammarProgress) {
                    if (parsed.grammarProgress[key].nextReview) {
                        parsed.grammarProgress[key].nextReview = new Date(parsed.grammarProgress[key].nextReview);
                    }
                    if (parsed.grammarProgress[key].lastReview) {
                        parsed.grammarProgress[key].lastReview = new Date(parsed.grammarProgress[key].lastReview);
                    }
                }
                return parsed;
            }
        } catch (e) {
            console.error('Error loading SRS data:', e);
        }

        // Default data structure
        return {
            grammarProgress: {},
            sessionStats: {
                totalReviews: 0,
                correctReviews: 0,
                streakDays: 0,
                lastSessionDate: null
            },
            settings: {
                newCardsPerDay: 5,
                reviewsPerDay: 20,
                baseInterval: 1, // days
                easyBonus: 1.3,
                hardPenalty: 0.5
            }
        };
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving SRS data:', e);
        }
    }

    // ========================================================================
    // GRAMMAR PROGRESS MANAGEMENT
    // ========================================================================

    getGrammarProgress(grammarId) {
        if (!this.data.grammarProgress[grammarId]) {
            this.data.grammarProgress[grammarId] = {
                easeFactor: 2.5,        // SM-2 ease factor (starts at 2.5)
                interval: 0,             // Current interval in days
                repetitions: 0,          // Number of successful repetitions
                nextReview: null,        // Next review date
                lastReview: null,        // Last review date
                totalAttempts: 0,        // Total number of attempts
                correctAttempts: 0,      // Correct attempts
                status: 'new'            // 'new', 'learning', 'reviewing', 'mastered'
            };
        }
        return this.data.grammarProgress[grammarId];
    }

    // ========================================================================
    // SM-2 ALGORITHM IMPLEMENTATION
    // ========================================================================

    /**
     * Process a review result and update the schedule
     * @param {string} grammarId - The grammar category ID
     * @param {number} quality - Quality of response (0-5 scale):
     *   0: Complete failure
     *   1: Incorrect, but recognized the answer
     *   2: Incorrect, but easy to recall
     *   3: Correct with serious difficulty
     *   4: Correct with some hesitation
     *   5: Perfect response
     */
    processReview(grammarId, quality) {
        const progress = this.getGrammarProgress(grammarId);
        const now = new Date();

        progress.totalAttempts++;
        progress.lastReview = now;

        if (quality >= 3) {
            // Correct response
            progress.correctAttempts++;

            if (progress.repetitions === 0) {
                progress.interval = 1;
            } else if (progress.repetitions === 1) {
                progress.interval = 3;
            } else {
                progress.interval = Math.round(progress.interval * progress.easeFactor);
            }

            progress.repetitions++;

            // Update ease factor using SM-2 formula
            progress.easeFactor = Math.max(1.3,
                progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
            );

            // Apply bonuses/penalties based on quality
            if (quality === 5) {
                progress.interval = Math.round(progress.interval * this.data.settings.easyBonus);
            } else if (quality === 3) {
                progress.interval = Math.round(progress.interval * this.data.settings.hardPenalty);
                progress.interval = Math.max(1, progress.interval);
            }

        } else {
            // Incorrect response - reset to learning
            progress.repetitions = 0;
            progress.interval = 0;
        }

        // Calculate next review date
        if (progress.interval === 0) {
            // Review again today (or within session for 'new' items)
            progress.nextReview = now;
            progress.status = 'learning';
        } else if (progress.interval >= 21) {
            progress.status = 'mastered';
            progress.nextReview = this.addDays(now, progress.interval);
        } else {
            progress.status = 'reviewing';
            progress.nextReview = this.addDays(now, progress.interval);
        }

        // Update session stats
        this.data.sessionStats.totalReviews++;
        if (quality >= 3) {
            this.data.sessionStats.correctReviews++;
        }

        this.save();

        return {
            grammarId,
            quality,
            newInterval: progress.interval,
            nextReview: progress.nextReview,
            status: progress.status
        };
    }

    /**
     * Convert similarity score (0-100) to SM-2 quality (0-5)
     */
    similarityToQuality(similarity) {
        if (similarity >= 95) return 5;  // Perfect
        if (similarity >= 85) return 4;  // Good
        if (similarity >= 70) return 3;  // Acceptable
        if (similarity >= 50) return 2;  // Almost
        if (similarity >= 25) return 1;  // Recognized
        return 0;  // Complete failure
    }

    // ========================================================================
    // REVIEW SCHEDULING
    // ========================================================================

    /**
     * Get grammar categories that are due for review
     * @param {string} level - Current CEFR level (e.g., 'A1', 'B2')
     * @returns {Array} Array of grammar IDs due for review, sorted by priority
     */
    getDueReviews(level = null) {
        const now = new Date();
        const due = [];

        for (const [grammarId, progress] of Object.entries(this.data.grammarProgress)) {
            // Filter by level if specified
            if (level && grammarCategories[grammarId]?.level !== level) {
                continue;
            }

            if (progress.nextReview && progress.nextReview <= now) {
                const overdueDays = Math.floor((now - progress.nextReview) / (1000 * 60 * 60 * 24));
                due.push({
                    grammarId,
                    progress,
                    overdueDays,
                    priority: this.calculatePriority(progress, overdueDays)
                });
            }
        }

        // Sort by priority (highest first)
        due.sort((a, b) => b.priority - a.priority);

        return due;
    }

    /**
     * Get new grammar categories that haven't been studied yet
     * @param {string} level - Current CEFR level
     * @returns {Array} Array of grammar IDs that are new
     */
    getNewGrammar(level) {
        const categories = getGrammarCategoriesForLevel(level);
        const newItems = [];

        for (const category of categories) {
            const progress = this.data.grammarProgress[category.id];
            if (!progress || progress.status === 'new') {
                newItems.push(category.id);
            }
        }

        return newItems;
    }

    /**
     * Calculate review priority
     */
    calculatePriority(progress, overdueDays) {
        let priority = 0;

        // Overdue items get higher priority
        priority += Math.min(overdueDays * 10, 100);

        // Items with lower ease factor need more practice
        priority += (3 - progress.easeFactor) * 20;

        // Learning items are higher priority than reviewing
        if (progress.status === 'learning') {
            priority += 50;
        }

        // Lower success rate = higher priority
        if (progress.totalAttempts > 0) {
            const successRate = progress.correctAttempts / progress.totalAttempts;
            priority += (1 - successRate) * 30;
        }

        return priority;
    }

    /**
     * Check if a grammar ID would cause too many consecutive repeats
     */
    wouldRepeatTooMuch(grammarId) {
        if (this.recentGrammar.length < this.maxConsecutiveSame) {
            return false;
        }
        // Check if the last N items are all the same as this one
        const lastN = this.recentGrammar.slice(-this.maxConsecutiveSame);
        return lastN.every(g => g === grammarId);
    }

    /**
     * Record that a grammar was used
     */
    recordGrammarUsed(grammarId) {
        this.recentGrammar.push(grammarId);
        // Keep only recent history
        if (this.recentGrammar.length > 10) {
            this.recentGrammar.shift();
        }
    }

    /**
     * Filter candidates to avoid too many consecutive repeats
     */
    filterForVariety(candidates, fallbackToAny = true) {
        const varied = candidates.filter(c => {
            const id = typeof c === 'string' ? c : c.grammarId;
            return !this.wouldRepeatTooMuch(id);
        });

        if (varied.length > 0) {
            return varied;
        }
        // If all would repeat too much, allow any if fallback enabled
        return fallbackToAny ? candidates : [];
    }

    /**
     * Get the next grammar category to practice
     * Balances between due reviews, new items, AND variety
     * @param {string} level - Current CEFR level
     * @returns {Object|null} { grammarId, isNew, reason }
     */
    getNextGrammar(level) {
        const dueReviews = this.getDueReviews(level);
        const newGrammar = this.getNewGrammar(level);
        const allLevelGrammar = getGrammarCategoriesForLevel(level);

        // Only prioritize VERY overdue items (5+ days), and still ensure variety
        const veryOverdue = this.filterForVariety(
            dueReviews.filter(r => r.overdueDays >= 5)
        );
        if (veryOverdue.length > 0) {
            const selected = veryOverdue[0];
            this.recordGrammarUsed(selected.grammarId);
            return {
                grammarId: selected.grammarId,
                isNew: false,
                reason: `Overdue by ${selected.overdueDays} days`
            };
        }

        // Build a weighted pool of options for variety
        const pool = [];

        // Add due reviews with weight based on priority (but not overwhelming)
        const variedDueReviews = this.filterForVariety(dueReviews, false);
        for (const review of variedDueReviews.slice(0, 3)) {
            pool.push({
                grammarId: review.grammarId,
                isNew: false,
                reason: review.overdueDays > 0 ? `Due ${review.overdueDays} days ago` : 'Due for review',
                weight: 2 + Math.min(review.overdueDays, 3) // Weight 2-5
            });
        }

        // Add new grammar with moderate weight
        const todayNew = this.getTodayNewCount();
        if (todayNew < this.data.settings.newCardsPerDay) {
            const variedNew = this.filterForVariety(newGrammar, false);
            for (const grammarId of variedNew.slice(0, 3)) {
                pool.push({
                    grammarId,
                    isNew: true,
                    reason: 'New grammar to learn',
                    weight: 3
                });
            }
        }

        // Add random grammar from the level for variety (lower weight)
        const variedRandom = this.filterForVariety(
            allLevelGrammar.map(g => g.id),
            false
        );
        for (const grammarId of variedRandom.slice(0, 2)) {
            // Don't add if already in pool
            if (!pool.some(p => p.grammarId === grammarId)) {
                pool.push({
                    grammarId,
                    isNew: !this.data.grammarProgress[grammarId],
                    reason: 'Practice variety',
                    weight: 1
                });
            }
        }

        // If pool is empty, fall back to any available grammar
        if (pool.length === 0) {
            if (dueReviews.length > 0) {
                const selected = dueReviews[0];
                this.recordGrammarUsed(selected.grammarId);
                return {
                    grammarId: selected.grammarId,
                    isNew: false,
                    reason: 'Due for review'
                };
            }
            if (newGrammar.length > 0) {
                const randomNew = newGrammar[Math.floor(Math.random() * newGrammar.length)];
                this.recordGrammarUsed(randomNew);
                return {
                    grammarId: randomNew,
                    isNew: true,
                    reason: 'New grammar to learn'
                };
            }
            if (allLevelGrammar.length > 0) {
                const randomGrammar = allLevelGrammar[Math.floor(Math.random() * allLevelGrammar.length)];
                this.recordGrammarUsed(randomGrammar.id);
                return {
                    grammarId: randomGrammar.id,
                    isNew: false,
                    reason: 'Practice'
                };
            }
            return null;
        }

        // Weighted random selection from pool
        const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;

        for (const item of pool) {
            random -= item.weight;
            if (random <= 0) {
                this.recordGrammarUsed(item.grammarId);
                return {
                    grammarId: item.grammarId,
                    isNew: item.isNew,
                    reason: item.reason
                };
            }
        }

        // Fallback (shouldn't reach here)
        const fallback = pool[0];
        this.recordGrammarUsed(fallback.grammarId);
        return {
            grammarId: fallback.grammarId,
            isNew: fallback.isNew,
            reason: fallback.reason
        };
    }

    // ========================================================================
    // STATISTICS
    // ========================================================================

    getTodayReviewCount() {
        const today = new Date().toDateString();
        let count = 0;

        for (const progress of Object.values(this.data.grammarProgress)) {
            if (progress.lastReview && new Date(progress.lastReview).toDateString() === today) {
                count++;
            }
        }

        return count;
    }

    getTodayNewCount() {
        const today = new Date().toDateString();
        let count = 0;

        for (const progress of Object.values(this.data.grammarProgress)) {
            if (progress.status !== 'new' &&
                progress.lastReview &&
                new Date(progress.lastReview).toDateString() === today &&
                progress.totalAttempts === 1) {
                count++;
            }
        }

        return count;
    }

    getOverallStats() {
        const stats = {
            totalGrammar: Object.keys(this.data.grammarProgress).length,
            mastered: 0,
            reviewing: 0,
            learning: 0,
            new: 0,
            dueToday: 0,
            overdueCount: 0,
            averageEaseFactor: 0,
            totalReviews: this.data.sessionStats.totalReviews,
            accuracy: 0
        };

        let easeSum = 0;
        const now = new Date();

        for (const progress of Object.values(this.data.grammarProgress)) {
            switch (progress.status) {
                case 'mastered': stats.mastered++; break;
                case 'reviewing': stats.reviewing++; break;
                case 'learning': stats.learning++; break;
                default: stats.new++; break;
            }

            easeSum += progress.easeFactor;

            if (progress.nextReview) {
                if (progress.nextReview <= now) {
                    stats.dueToday++;
                    const overdueDays = Math.floor((now - progress.nextReview) / (1000 * 60 * 60 * 24));
                    if (overdueDays > 0) {
                        stats.overdueCount++;
                    }
                }
            }
        }

        if (stats.totalGrammar > 0) {
            stats.averageEaseFactor = easeSum / stats.totalGrammar;
        }

        if (this.data.sessionStats.totalReviews > 0) {
            stats.accuracy = Math.round(
                (this.data.sessionStats.correctReviews / this.data.sessionStats.totalReviews) * 100
            );
        }

        return stats;
    }

    getGrammarStats(grammarId) {
        const progress = this.getGrammarProgress(grammarId);
        const category = grammarCategories[grammarId];

        return {
            id: grammarId,
            name: category?.name || grammarId,
            level: category?.level || 'Unknown',
            description: category?.description || '',
            status: progress.status,
            interval: progress.interval,
            easeFactor: progress.easeFactor.toFixed(2),
            nextReview: progress.nextReview,
            lastReview: progress.lastReview,
            totalAttempts: progress.totalAttempts,
            correctAttempts: progress.correctAttempts,
            accuracy: progress.totalAttempts > 0
                ? Math.round((progress.correctAttempts / progress.totalAttempts) * 100)
                : 0
        };
    }

    getAllGrammarStats(level = null) {
        const allCategories = level
            ? getGrammarCategoriesForLevel(level)
            : Object.keys(grammarCategories).map(id => ({ id, ...grammarCategories[id] }));

        return allCategories.map(cat => this.getGrammarStats(cat.id));
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    formatNextReview(date) {
        if (!date) return 'Not scheduled';

        const now = new Date();
        const diffMs = date - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else if (diffDays < 7) {
            return `Due in ${diffDays} days`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `Due in ${weeks} week${weeks !== 1 ? 's' : ''}`;
        } else {
            const months = Math.floor(diffDays / 30);
            return `Due in ${months} month${months !== 1 ? 's' : ''}`;
        }
    }

    getStatusColor(status) {
        switch (status) {
            case 'mastered': return '#34d399';
            case 'reviewing': return '#818cf8';
            case 'learning': return '#fbbf24';
            case 'new': return '#94a3b8';
            default: return '#94a3b8';
        }
    }

    getStatusIcon(status) {
        switch (status) {
            case 'mastered': return '★';
            case 'reviewing': return '↻';
            case 'learning': return '◐';
            case 'new': return '○';
            default: return '○';
        }
    }

    // ========================================================================
    // DATA MANAGEMENT
    // ========================================================================

    resetProgress(grammarId = null) {
        if (grammarId) {
            delete this.data.grammarProgress[grammarId];
        } else {
            this.data.grammarProgress = {};
            this.data.sessionStats = {
                totalReviews: 0,
                correctReviews: 0,
                streakDays: 0,
                lastSessionDate: null
            };
        }
        this.save();
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.data = imported;
            this.save();
            return true;
        } catch (e) {
            console.error('Error importing SRS data:', e);
            return false;
        }
    }
}

// Create global instance
const srs = new SpacedRepetitionSystem();

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpacedRepetitionSystem, srs };
}
