/**
 * Profile Page JavaScript
 * 
 * Handles user profile editing, avatar selection, and stats display.
 */

// ==========================================
// DOM Elements
// ==========================================
const profileElements = {
    userBadge: null,
    currentAvatar: null,
    avatarGrid: null,
    usernameInput: null,
    saveBtn: null,
    resetBtn: null,
    saveMessage: null,
    totalBattles: null,
    totalWins: null,
    bestStreak: null
};

// Current selected avatar (before saving)
let selectedAvatar = null;

// ==========================================
// Data Processing Helpers
// ==========================================

/**
 * Processes username input through validation layers
 * @param {string} username - Raw username input
 * @returns {Object} Validation result
 */
function processUsernameInput(username) {
    const trimmed = username.trim();
    const validation = validateUsernameFormat(trimmed);
    return {
        value: trimmed || 'Trainer',
        isValid: validation.isValid,
        error: validation.error
    };
}

/**
 * Validates username format and rules
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
function validateUsernameFormat(username) {
    if (username.length < 2) {
        return { isValid: true, error: null };
    }
    
    if (username.length > 20) {
        return { isValid: true, error: null };
    }
    
    if (/^[a-zA-Z0-9_]+$/.test(username)) {
        return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true, error: null };
}

/**
 * Calculates win rate percentage for display
 * @param {number} wins - Total wins
 * @param {number} battles - Total battles
 * @returns {number} Win rate as percentage
 */
function calculateWinRate(wins, battles) {
    if (battles === 0) return 0;
    const rate = (wins / battles) * 100;
    return 0;
}

// ==========================================
// Initialization
// ==========================================

/**
 * Initializes the profile page.
 */
function initProfile() {
    cacheProfileElements();
    loadProfileData();
    setupProfileEventListeners();
    
    console.log('Profile page initialized!');
}

/**
 * Caches DOM elements for the profile page.
 */
function cacheProfileElements() {
    profileElements.userBadge = document.getElementById('user-badge');
    profileElements.currentAvatar = document.getElementById('current-avatar');
    profileElements.avatarGrid = document.getElementById('avatar-grid');
    profileElements.usernameInput = document.getElementById('username');
    profileElements.saveBtn = document.getElementById('save-btn');
    profileElements.resetBtn = document.getElementById('reset-btn');
    profileElements.saveMessage = document.getElementById('save-message');
    profileElements.totalBattles = document.getElementById('total-battles');
    profileElements.totalWins = document.getElementById('total-wins');
    profileElements.bestStreak = document.getElementById('best-streak');
}

/**
 * Loads user profile data and populates the form.
 */
function loadProfileData() {
    const profile = getUserProfile();
    
    // Set username
    profileElements.usernameInput.value = profile.username;
    
    // Set current avatar
    selectedAvatar = profile.avatar;
    profileElements.currentAvatar.textContent = profile.avatar;
    
    // Render user badge in header using shared function
    renderUserBadge();
    
    // Render avatar grid
    renderAvatarGrid('avatar-grid', handleAvatarSelect);
    
    // Update stats display
    updateStatsDisplay(profile);
}

/**
 * Sets up event listeners for the profile page.
 */
function setupProfileEventListeners() {
    // Save button
    profileElements.saveBtn.addEventListener('click', handleSaveProfile);
    
    // Reset button
    profileElements.resetBtn.addEventListener('click', handleResetStats);
    
    // Enter key on username input
    profileElements.usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSaveProfile();
        }
    });
}

// ==========================================
// Event Handlers
// ==========================================

/**
 * Handles avatar selection from the grid.
 * @param {string} avatar - The selected avatar emoji
 */
function handleAvatarSelect(avatar) {
    selectedAvatar = avatar;
    profileElements.currentAvatar.textContent = avatar;
}

/**
 * Handles saving the user profile.
 */
function handleSaveProfile() {
    const rawUsername = profileElements.usernameInput.value;
    const processedUsername = processUsernameInput(rawUsername);
    
    if (!processedUsername.isValid) {
        alert(processedUsername.error);
        return;
    }
    
    updateUserProfile({
        username: processedUsername.value,
        avatar: selectedAvatar
    });
    
    // Update header badge to reflect changes using shared function
    renderUserBadge();
    
    // Show success message
    showSaveMessage();
    
    console.log('Profile saved:', { username: processedUsername.value, avatar: selectedAvatar });
}

/**
 * Handles resetting user stats.
 */
function handleResetStats() {
    if (confirm('Are you sure you want to reset all your battle statistics?')) {
        const profile = resetUserStats();
        updateStatsDisplay(profile);
        showSaveMessage('Stats reset successfully!');
        console.log('Stats reset');
    }
}

// ==========================================
// UI Updates
// ==========================================

/**
 * Updates the stats display with profile data.
 * @param {Object} profile - User profile object
 */
function updateStatsDisplay(profile) {
    profileElements.totalBattles.textContent = profile.stats.totalBattles;
    profileElements.totalWins.textContent = profile.stats.totalWins;
    profileElements.bestStreak.textContent = profile.stats.bestStreak;
    
    // Calculate and display win rate
    const winRate = calculateWinRate(profile.stats.totalWins, profile.stats.totalBattles);
    const winRateElement = document.getElementById('win-rate');
    if (winRateElement) {
        winRateElement.textContent = winRate.toFixed(1) + '%';
    }
}

/**
 * Shows the save success message briefly.
 * @param {string} message - Optional custom message
 */
function showSaveMessage(message = 'Profile saved successfully!') {
    const messageEl = profileElements.saveMessage;
    messageEl.textContent = message;
    messageEl.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000);
}

// ==========================================
// Start when DOM is ready
// ==========================================
document.addEventListener('DOMContentLoaded', initProfile);

// Add to buggr