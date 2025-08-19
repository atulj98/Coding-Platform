const API_BASE_URL = 'http://localhost:3002/api';
const CODE_EXEC_API_URL = 'http://localhost:3001/api';

// Global data storage
let submissions = [];
let problems = [];
let users = new Set();

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Utility functions
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('response').textContent = '';
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function displayResponse(data, isError = false) {
    hideLoading();
    const responseElement = document.getElementById('response');
    responseElement.textContent = JSON.stringify(data, null, 2);
    responseElement.className = isError ? 'error' : 'success';
}

function displayError(error) {
    hideLoading();
    const responseElement = document.getElementById('response');
    responseElement.textContent = `Error: ${error.message || error}`;
    responseElement.className = 'error';
}

function updateStatus(message, type = 'info') {
    const statusEl = document.getElementById('dataStatus');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

// API call function
async function makeApiCall(url, options = {}) {
    try {
        showLoading();
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }
        
        displayResponse(data);
        return data;
    } catch (error) {
        displayError(error);
        throw error;
    }
}

// Data loading functions
async function loadInitialData() {
    updateStatus('Loading data...', 'info');
    try {
        await Promise.all([
            loadSubmissions(),
            loadProblems()
        ]);
        populateDropdowns();
        updateStatus('Data loaded successfully', 'success');
    } catch (error) {
        updateStatus('Failed to load data', 'error');
        console.error('Error loading data:', error);
    }
}

async function loadSubmissions() {
    try {
        const response = await fetch(`${CODE_EXEC_API_URL}/submissions?limit=100`);
        if (response.ok) {
            const data = await response.json();
            submissions = data.submissions || data || [];
            
            // Extract unique users
            submissions.forEach(sub => {
                if (sub.userId) users.add(sub.userId);
            });
        }
    } catch (error) {
        console.error('Error loading submissions:', error);
        // Try to load from results API as fallback
        try {
            const response = await fetch(`${API_BASE_URL}/results/recent?limit=100`);
            if (response.ok) {
                const data = await response.json();
                submissions = data || [];
                submissions.forEach(sub => {
                    if (sub.userId) users.add(sub.userId);
                });
            }
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
    }
}

async function loadProblems() {
    try {
        const response = await fetch(`${CODE_EXEC_API_URL}/problems`);
        if (response.ok) {
            const data = await response.json();
            problems = data.problems || data || [];
        }
    } catch (error) {
        console.error('Error loading problems:', error);
        // Create sample problems if API fails
        problems = [
            { _id: 'problem_1', title: 'Two Sum', difficulty: 'EASY' },
            { _id: 'problem_2', title: 'Add Two Numbers', difficulty: 'MEDIUM' },
            { _id: 'problem_3', title: 'Longest Substring', difficulty: 'HARD' }
        ];
    }
}

function populateDropdowns() {
    // Populate submission dropdowns
    const submissionSelects = ['getSubmissionId'];
    submissionSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Submission</option>';
        submissions.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub._id;
            option.textContent = `${sub._id} - ${sub.language} - ${sub.status}`;
            select.appendChild(option);
        });
    });

    // Populate user dropdowns
    const userSelects = ['getUserId', 'perfUserId', 'userProblemUserId', 'analyticsUserId'];
    userSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select User</option>';
        Array.from(users).forEach(userId => {
            const option = document.createElement('option');
            option.value = userId;
            option.textContent = userId;
            select.appendChild(option);
        });
    });

    // Populate problem dropdowns
    const problemSelects = ['getProblemId', 'filterProblemId', 'diffProblemId', 'userProblemProblemId'];
    problemSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (selectId === 'filterProblemId') {
            select.innerHTML = '<option value="">All Problems</option>';
        } else {
            select.innerHTML = '<option value="">Select Problem</option>';
        }
        problems.forEach(problem => {
            const option = document.createElement('option');
            option.value = problem._id;
            option.textContent = `${problem.title} (${problem.difficulty})`;
            select.appendChild(option);
        });
    });
}

async function refreshSubmissions() {
    await loadSubmissions();
    populateDropdowns();
    updateStatus('Submissions refreshed', 'success');
}

// Event listeners for forms
document.addEventListener('DOMContentLoaded', () => {
    // Results API calls
    document.getElementById('getResultsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submissionId = document.getElementById('getSubmissionId').value;
        await makeApiCall(`${API_BASE_URL}/results/${submissionId}`);
    });

    document.getElementById('getUserResultsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('getUserId').value;
        const page = document.getElementById('page').value || 1;
        const limit = document.getElementById('limit').value || 10;
        const status = document.getElementById('filterStatus').value;
        const problemId = document.getElementById('filterProblemId').value;
        
        let url = `${API_BASE_URL}/results/user/${userId}?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (problemId) url += `&problemId=${problemId}`;
        
        await makeApiCall(url);
    });

    document.getElementById('getProblemStatsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const problemId = document.getElementById('getProblemId').value;
        await makeApiCall(`${API_BASE_URL}/results/problem/${problemId}/stats`);
    });

    document.getElementById('getUserProblemForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('userProblemUserId').value;
        const problemId = document.getElementById('userProblemProblemId').value;
        await makeApiCall(`${API_BASE_URL}/results/user/${userId}/problem/${problemId}`);
    });

    document.getElementById('getRecentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const limit = document.getElementById('recentLimit').value || 10;
        await makeApiCall(`${API_BASE_URL}/results/recent?limit=${limit}`);
    });

    document.getElementById('getTrendsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const days = document.getElementById('trendsDays').value || 30;
        await makeApiCall(`${API_BASE_URL}/results/trends?days=${days}`);
    });

    // Analysis API calls
    document.getElementById('userPerformanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('perfUserId').value;
        const timeframe = document.getElementById('timeframe').value;
        await makeApiCall(`${API_BASE_URL}/analysis/user/${userId}/performance?timeframe=${timeframe}`);
    });

    document.getElementById('problemDifficultyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const problemId = document.getElementById('diffProblemId').value;
        await makeApiCall(`${API_BASE_URL}/analysis/problem/${problemId}/difficulty`);
    });

    document.getElementById('submissionTrendsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const period = document.getElementById('period').value;
        const limit = document.getElementById('trendsLimit').value || 10;
        await makeApiCall(`${API_BASE_URL}/analysis/trends?period=${period}&limit=${limit}`);
    });

    document.getElementById('leaderboardForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const limit = document.getElementById('leaderLimit').value || 50;
        const timeframe = document.getElementById('leaderTimeframe').value;
        await makeApiCall(`${API_BASE_URL}/analysis/leaderboard?limit=${limit}&timeframe=${timeframe}`);
    });

    document.getElementById('detailedAnalyticsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('analyticsUserId').value;
        await makeApiCall(`${API_BASE_URL}/analysis/analytics/${userId}`);
    });

    // Health check
    document.getElementById('healthCheckBtn').addEventListener('click', async () => {
        await makeApiCall('http://localhost:3002/health');
    });

    // Auto-load data on page load
    loadInitialData();
});
