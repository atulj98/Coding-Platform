const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const API_BASE = 'http://localhost:9000/api/code';
const API_PROBLEMS_BASE = 'http://localhost:9000/api/problems';
const RESULTS_API_BASE = 'http://localhost:3002/api/results';
const ANALYSIS_API_BASE = 'http://localhost:3002/api/analysis';
const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmU1ODRiOGVhYWViYWRlNGEwYWM5ZiIsImlhdCI6MTc1MjA2MjAyNywiZXhwIjoxNzUyNjY2ODI3fQ.LnEtSPkDAdXhgQ_8HVkQd2tQiEWh5N0e0yiS7r_lU7Q';

// Always "logged in"
function requireAuth(req, res, next) {
  next();
}

function getToken() {
  return STATIC_TOKEN;
}

// CSS styles
const getStyles = () => `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
    color: #333;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    padding: 30px;
    text-align: center;
  }

  .header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    font-weight: 300;
  }

  .header p {
    font-size: 1.1em;
    opacity: 0.9;
  }

  .content {
    padding: 40px;
  }

  .form-group {
    margin-bottom: 25px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #555;
    font-size: 1.1em;
  }

  input[type="text"], select, textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  input[type="text"]:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  textarea {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    resize: vertical;
    min-height: 200px;
    background: #f8f9fa;
  }

  .btn {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    margin: 10px 5px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  .btn-secondary {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  }

  .btn-success {
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  }

  .btn-danger {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  }

  .nav-links {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }

  .nav-links a {
    margin: 0 15px;
  }

  .submissions-list {
    list-style: none;
  }

  .submission-item {
    background: #f8f9fa;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .submission-info {
    flex: 1;
  }

  .submission-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  .submission-meta {
    color: #7f8c8d;
    font-size: 0.9em;
  }

  .status {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-accepted {
    background: #d4edda;
    color: #155724;
  }

  .status-rejected {
    background: #f8d7da;
    color: #721c24;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-easy {
    background: #d4edda;
    color: #155724;
  }

  .status-medium {
    background: #fff3cd;
    color: #856404;
  }

  .status-hard {
    background: #f8d7da;
    color: #721c24;
  }

  .problems-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .code-display {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 20px;
    border-radius: 8px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.6;
    overflow-x: auto;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #e74c3c;
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #27ae60;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }

  .function-signature-group {
    margin-bottom: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .function-signature-group label {
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    display: block;
  }

  .function-signature-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    background: white;
  }

  .code-editor-section {
    margin-top: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }

  .editor-header {
    background: #f5f5f5;
    padding: 15px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .language-selector select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    font-size: 14px;
  }

  .code-editor textarea {
    width: 100%;
    min-height: 300px;
    border: none;
    padding: 15px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    background: #fafafa;
  }

  .output-section {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .output-display {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
  }

  .test-results {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .test-case-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .test-case-status {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .test-case-status.passed {
    background-color: #22c55e;
    border: 2px solid #16a34a;
  }

  .test-case-status.failed {
    background-color: #ef4444;
    border: 2px solid #dc2626;
  }

  .test-case-status.pending {
    background-color: #94a3b8;
    border: 2px solid #64748b;
  }

  .test-case-info {
    flex: 1;
  }

  .test-case-title {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .test-case-details {
    font-size: 0.875rem;
    color: #6b7280;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .test-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .test-summary-left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .test-summary-status {
    font-weight: 600;
    font-size: 1.1em;
  }

  .test-summary-status.all-passed {
    color: #16a34a;
  }

  .test-summary-status.some-failed {
    color: #dc2626;
  }

  .test-summary-status.not-run {
    color: #6b7280;
  }

  .test-dots {
    display: flex;
    gap: 4px;
  }

  .test-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .test-dot.passed {
    background-color: #22c55e;
  }

  .test-dot.failed {
    background-color: #ef4444;
  }

  .test-dot.pending {
    background-color: #94a3b8;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .btn-submit {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
  }

  .btn-submit:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .execution-info {
    margin-top: 10px;
    padding: 10px;
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #4b5563;
  }

  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
    }
    
    .container {
      margin: 10px;
    }
    
    .content {
      padding: 20px;
    }
  }
</style>`;

// Backend service URLs
const BACKEND_SERVICES = {
    codeExecution: 'http://localhost:9001',
    resultsAnalysis: 'http://localhost:3002'
};

// Health check function
async function checkBackendServices() {
    const services = {};
    
    for (const [name, url] of Object.entries(BACKEND_SERVICES)) {
        try {
            const response = await fetch(`${url}/health`, { 
                method: 'GET',
                timeout: 5000 
            });
            services[name] = response.ok;
        } catch (error) {
            services[name] = false;
        }
    }
    
    return services;
}

// Helper function to fetch test cases for a problem
async function fetchTestCases(problemId, token) {
  try {
    const response = await axios.get(`${API_PROBLEMS_BASE}/${problemId}/testcases`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching test cases for problem ${problemId}:`, error.message);
    return [];
  }
}

// Helper to extract editable region from template
function extractEditableRegion(template) {
  // Look for "// write your function here" or "#\s*write your function here"
  const marker = /\/\/\s*write your function here|#\s*write your function here/i;
  const lines = template.split('\n');
  let start = 0, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (marker.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  // Assume editable region is until next marker or end of file
  for (let i = start; i < lines.length; i++) {
    if (marker.test(lines[i])) {
      end = i;
      break;
    }
  }
  return {
    before: lines.slice(0, start).join('\n'),
    editable: lines.slice(start, end).join('\n'),
    after: lines.slice(end).join('\n')
  };
}

// Home page: code submission form
app.get('/', async (req, res) => {
  const serviceStatus = await checkBackendServices();
  const unavailableServices = Object.entries(serviceStatus)
      .filter(([name, status]) => !status)
      .map(([name]) => name);
  
  try {
    const token = getToken();
    
    // Add timeout and better error handling for backend calls
    const axiosConfig = {
      timeout: 5000, // 5 second timeout
      headers: { Authorization: `Bearer ${token}` }
    };
    
    // Fetch languages and problems in parallel with error handling
    let languages = [];
    let problems = [];
    let backendWarning = '';
    
    try {
      const [languagesRes, problemsRes] = await Promise.all([
        axios.get(`${API_BASE}/languages`, { timeout: 5000 }),
        axios.get(`${API_PROBLEMS_BASE}`, axiosConfig)
      ]);
      
      languages = Object.keys(languagesRes.data.data || {});
      
      // Defensive: ensure problems is always an array
      if (Array.isArray(problemsRes.data.data)) {
        problems = problemsRes.data.data;
      } else if (Array.isArray(problemsRes.data.data.problems)) {
        problems = problemsRes.data.data.problems;
      }
    } catch (backendError) {
      console.error('Backend services unavailable:', backendError.message);
      
      // Add warning message for UI
      backendWarning = `
        <div class="error-message" style="margin-bottom: 20px;">
          ⚠️ <strong>Backend services are currently unavailable.</strong><br>
          Running in demo mode with limited functionality. Some features may not work properly.
        </div>
      `;
      
      // Provide fallback data when backend is not available
      languages = ['javascript', 'python', 'cpp', 'java'];
      problems = [
        {
          _id: 'demo-1',
          title: 'Demo Problem (Backend Offline)',
          difficulty: 'easy',
          description: 'This is a demo problem. Backend services are currently unavailable.',
          tags: ['demo'],
          testCases: [
            { _id: 'test-1', input: '2, 3', output: '5', isHidden: false }
          ],
          functionSignatures: {
            javascript: 'function add(a, b) {',
            python: 'def add(a, b):',
            cpp: 'int add(int a, int b) {',
            java: 'public int add(int a, int b) {'
          }
        }
      ];
    }

    // Fetch test cases for each problem if they don't already have them
    if (problems.length > 0) {
      const problemsWithTestCases = await Promise.all(
        problems.map(async (problem) => {
          if (!problem.testCases || problem.testCases.length === 0) {
            const testCases = await fetchTestCases(problem._id, token);
            return { ...problem, testCases };
          }
          return problem;
        })
      );
      problems = problemsWithTestCases;
    }

    // If languages or problems is empty, show a message
    if (!languages.length || !problems.length) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error - Code Platform</title>
          ${getStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ No Data</h1>
            </div>
            <div class="content">
              <div class="error-message">
                ${!languages.length ? 'No languages found from backend.<br>' : ''}
                ${!problems.length ? 'No problems found from backend.<br>' : ''}
              </div>
              <a href="/" class="btn">🔄 Try Again</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    // Fixed JavaScript to avoid conflicts
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Submission Platform</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💻 Code Submission Platform</h1>
            <p>Submit your code solutions and track your progress</p>
            <div style="margin-top: 20px;">
              <button class="btn btn-success" id="submit-btn" onclick="showTab('submit')">📝 Submit Solution</button>
              <button class="btn btn-secondary" id="problems-btn" onclick="showTab('problems')">📋 Manage Problems</button>
              <button class="btn btn-secondary" id="analytics-btn" onclick="showTab('analytics')">📊 Analytics</button>
              <button class="btn btn-secondary" id="results-btn" onclick="showTab('results')">📈 Results</button>
            </div>
          </div>
          <div class="content">
            ${backendWarning}
            
            <!-- Submit Code Tab -->
            <div id="submit-tab">
              <div class="grid">
                <div class="form-group">
                  <label for="problemId">Select Problem</label>
                  <select id="problemId" name="problemId" required>
                    <option value="">Choose a problem...</option>
                    ${problems.map(p => `<option value="${p._id}">${p.title}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label for="language">Programming Language</label>
                  <select id="language" name="language">
                    ${languages.map(l => `<option value="${l}">${l.charAt(0).toUpperCase() + l.slice(1)}</option>`).join('')}
                  </select>
                </div>
              </div>
              
              <div class="code-editor-section">
                <div class="editor-header">
                  <h3>Write Your Solution</h3>
                  <div class="language-selector">
                    <button id="run-btn" class="btn btn-success" onclick="executeCode()">🚀 Run Code</button>
                  </div>
                </div>
                <div class="code-editor">
                  <textarea id="code" placeholder="Select a problem and language to see the function signature..."></textarea>
                </div>
                
                <!-- Test Results Section -->
                <div id="test-results-section" style="display: none;">
                  <div class="test-results">
                    <div class="test-summary">
                      <div class="test-summary-left">
                        <div class="test-summary-status" id="test-summary-status">Ready to test</div>
                        <div class="test-dots" id="test-dots"></div>
                      </div>
                      <div class="action-buttons">
                        <button id="submit-solution-btn" class="btn-submit" onclick="submitSolution()" disabled>
                          📤 Submit Solution
                        </button>
                      </div>
                    </div>
                    <div id="test-cases-results"></div>
                    <div id="execution-info" class="execution-info" style="display: none;"></div>
                  </div>
                </div>
                
                <div class="output-section">
                  <h4>Console Output:</h4>
                  <pre id="output" class="output-display">Click "Run Code" to see the results...</pre>
                </div>
              </div>
              
              <div id="test-cases-display" style="margin-top: 20px; display: none;">
                <h4>Test Cases:</h4>
                <div id="test-cases-content"></div>
              </div>
            </div>

            <!-- Problem Management Tab -->
            <div id="problems-tab" style="display: none;">
              <h3>Create New Problem</h3>
              <form method="POST" action="/create-problem">
                <div class="grid">
                  <div class="form-group">
                    <label for="title">Problem Title</label>
                    <input type="text" id="title" name="title" required placeholder="e.g., Two Sum" />
                  </div>
                  <div class="form-group">
                    <label for="difficulty">Difficulty</label>
                    <select id="difficulty" name="difficulty" required>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="description">Problem Description</label>
                  <textarea id="description" name="description" rows="6" required placeholder="Describe the problem in detail..."></textarea>
                </div>
                <div class="form-group">
                  <label for="tags">Tags (comma-separated)</label>
                  <input type="text" id="tags" name="tags" placeholder="e.g., array, hash-table, math" />
                </div>
                
                <div class="form-group">
                  <label>Function Signatures:</label>
                  
                  <div class="function-signature-group">
                    <label>C++:</label>
                    <input type="text" id="functionSignature-cpp" name="functionSignature-cpp" 
                           placeholder="e.g., vector<int> twoSum(vector<int>& nums, int target)"
                           class="function-signature-input" />
                  </div>
                  
                  <div class="function-signature-group">
                    <label>Python:</label>
                    <input type="text" id="functionSignature-python" name="functionSignature-python"
                           placeholder="e.g., def twoSum(self, nums: List[int], target: int) -> List[int]:"
                           class="function-signature-input" />
                  </div>
                  
                  <div class="function-signature-group">
                    <label>Java:</label>
                    <input type="text" id="functionSignature-java" name="functionSignature-java"
                           placeholder="e.g., public int[] twoSum(int[] nums, int target)"
                           class="function-signature-input" />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="testCases">Test Cases (JSON format)</label>
                  <textarea id="testCases" name="testCases" rows="8" required placeholder='[
  {"input": "[2,7,11,15]\\n9", "output": "[0,1]"},
  {"input": "[3,2,4]\\n6", "output": "[1,2]"}
]'></textarea>
                </div>
                <button type="submit" class="btn btn-success">✨ Create Problem</button>
              </form>

              <hr style="margin: 40px 0; border: 1px solid #eee;">
              
              <h3>Existing Problems</h3>
              <div class="problems-list">
                ${problems.length === 0 ? 
                  '<p style="color: #666; text-align: center;">No problems available</p>' :
                  problems.map(p => `
                    <div class="submission-item">
                      <div class="submission-info">
                        <div class="submission-title">${p.title}</div>
                        <div class="submission-meta">
                          Difficulty: <span class="status status-${p.difficulty}">${p.difficulty}</span> • 
                          Tags: ${(p.tags || []).join(', ') || 'None'} • 
                          Test Cases: ${(p.testCases || []).length}
                        </div>
                      </div>
                      <div>
                        <a href="/problem/${p._id}" class="btn" style="margin-right: 10px;">👀 View</a>
                        <a href="/edit-problem/${p._id}" class="btn btn-secondary">✏️ Edit</a>
                      </div>
                    </div>
                  `).join('')
                }
              </div>
            </div>

            <!-- Analytics Tab -->
            <div id="analytics-tab" style="display: none;">
              <h3>📊 Performance Analytics</h3>
              
              <!-- User Performance Section -->
              <div class="form-group">
                <h4>User Performance Analysis</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="analytics-user-id">User ID</label>
                    <input type="text" id="analytics-user-id" placeholder="Enter user ID" value="user123" />
                  </div>
                  <div class="form-group">
                    <label for="analytics-timeframe">Timeframe</label>
                    <select id="analytics-timeframe">
                      <option value="7d">Last 7 days</option>
                      <option value="30d" selected>Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                </div>
                <button class="btn btn-success" onclick="getUserPerformance()">📈 Get Performance</button>
              </div>

              <!-- Problem Difficulty Analysis -->
              <div class="form-group">
                <h4>Problem Difficulty Analysis</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="difficulty-problem-id">Problem</label>
                    <select id="difficulty-problem-id">
                      <option value="">Select a problem...</option>
                      ${problems.map(p => `<option value="${p._id}">${p.title}</option>`).join('')}
                    </select>
                  </div>
                  <div style="display: flex; align-items: end;">
                    <button class="btn btn-success" onclick="getProblemDifficulty()">🧩 Analyze Difficulty</button>
                  </div>
                </div>
              </div>

              <!-- Leaderboard -->
              <div class="form-group">
                <h4>Leaderboard</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="leaderboard-limit">Number of Users</label>
                    <input type="number" id="leaderboard-limit" value="10" min="5" max="50" />
                  </div>
                  <div class="form-group">
                    <label for="leaderboard-timeframe">Timeframe</label>
                    <select id="leaderboard-timeframe">
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="all" selected>All time</option>
                    </select>
                  </div>
                </div>
                <button class="btn btn-success" onclick="getLeaderboard()">🏆 Get Leaderboard</button>
              </div>

              <!-- Submission Trends -->
              <div class="form-group">
                <h4>Submission Trends</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="trends-period">Period</label>
                    <select id="trends-period">
                      <option value="daily">Daily</option>
                      <option value="weekly" selected>Weekly</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="trends-limit">Number of Periods</label>
                    <input type="number" id="trends-limit" value="10" min="5" max="30" />
                  </div>
                </div>
                <button class="btn btn-success" onclick="getSubmissionTrends()">📈 Get Trends</button>
              </div>

              <!-- Analytics Results Display -->
              <div id="analytics-results" style="margin-top: 30px; display: none;">
                <h4>Analysis Results</h4>
                <div id="analytics-content" class="json-container"></div>
              </div>
            </div>

            <!-- Results Tab -->
            <div id="results-tab" style="display: none;">
              <h3>📈 Submission Results</h3>
              
              <!-- Recent Submissions -->
              <div class="form-group">
                <h4>Recent Submissions</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="recent-limit">Number of Submissions</label>
                    <input type="number" id="recent-limit" value="10" min="5" max="50" />
                  </div>
                  <div style="display: flex; align-items: end;">
                    <button class="btn btn-success" onclick="getRecentSubmissions()">🔄 Get Recent</button>
                  </div>
                </div>
              </div>

              <!-- User Results -->
              <div class="form-group">
                <h4>User Results History</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="results-user-id">User ID</label>
                    <input type="text" id="results-user-id" placeholder="Enter user ID" value="user123" />
                  </div>
                  <div class="form-group">
                    <label for="results-status">Status Filter</label>
                    <select id="results-status">
                      <option value="">All Statuses</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="PENDING">Pending</option>
                      <option value="ERROR">Error</option>
                    </select>
                  </div>
                </div>
                <button class="btn btn-success" onclick="getUserResults()">👤 Get User Results</button>
              </div>

              <!-- Problem Statistics -->
              <div class="form-group">
                <h4>Problem Statistics</h4>
                <div class="grid">
                  <div class="form-group">
                    <label for="stats-problem-id">Problem</label>
                    <select id="stats-problem-id">
                      <option value="">Select a problem...</option>
                      ${problems.map(p => `<option value="${p._id}">${p.title}</option>`).join('')}
                    </select>
                  </div>
                  <div style="display: flex; align-items: end;">
                    <button class="btn btn-success" onclick="getProblemStats()">📊 Get Statistics</button>
                  </div>
                </div>
              </div>

              <!-- Results Display -->
              <div id="results-display" style="margin-top: 30px; display: none;">
                <h4>Results</h4>
                <div id="results-content"></div>
              </div>
            </div>

            <div class="nav-links">
              <a href="/submissions" class="btn btn-secondary">📋 View My Submissions</a>
              <a href="/analytics-dashboard" class="btn btn-secondary">📊 Full Analytics Dashboard</a>
            </div>
          </div>
        </div>

        <script>
          const problems = ${JSON.stringify(problems)};
          const languages = ${JSON.stringify(languages)};
          const isBackendAvailable = ${problems.length > 0 && problems[0]._id !== 'demo-1'};
          
          function showTab(tabName) {
            // Hide all tabs
            document.getElementById('submit-tab').style.display = 'none';
            document.getElementById('problems-tab').style.display = 'none';
            document.getElementById('analytics-tab').style.display = 'none';
            document.getElementById('results-tab').style.display = 'none';
            
            // Show selected tab
            document.getElementById(tabName + '-tab').style.display = 'block';
            
            // Update button styles
            document.getElementById('submit-btn').className = 'btn btn-secondary';
            document.getElementById('problems-btn').className = 'btn btn-secondary';
            document.getElementById('analytics-btn').className = 'btn btn-secondary';
            document.getElementById('results-btn').className = 'btn btn-secondary';
            
            if (tabName === 'submit') {
              document.getElementById('submit-btn').className = 'btn btn-success';
            } else if (tabName === 'problems') {
              document.getElementById('problems-btn').className = 'btn btn-success';
            } else if (tabName === 'analytics') {
              document.getElementById('analytics-btn').className = 'btn btn-success';
            } else if (tabName === 'results') {
              document.getElementById('results-btn').className = 'btn btn-success';
            }
          }

          function getPlaceholderCode() {
            const problemId = document.getElementById('problemId').value;
            const language = document.getElementById('language').value;
            const problem = problems.find(p => p._id === problemId);
            
            if (!problem || !problem.functionSignatures) return '';
            
            const signature = problem.functionSignatures[language];
            if (!signature) return '';

            switch (language) {
              case 'cpp':
                return \`// Write your solution here\\n\${signature} {\\n    // Your code here\\n}\`;
              case 'python':
                return \`# Write your solution here\\n\${signature}\\n    # Your code here\\n    pass\`;
              case 'java':
                return \`// Write your solution here\\n\${signature} {\\n    // Your code here\\n}\`;
              default:
                return '';
            }
          }

          function updateCodeEditor() {
            const problemId = document.getElementById('problemId').value;
            const problem = problems.find(p => p._id === problemId);
            currentProblem = problem;
            
            // Update code editor with placeholder
            const placeholder = getPlaceholderCode();
            const codeEditor = document.getElementById('code');
            if (placeholder && !codeEditor.value.trim()) {
              codeEditor.value = placeholder;
            }
            
            // Reset test results when problem changes
            resetTestResults();
            
            // Update test cases display
            if (problem && problem.testCases && Array.isArray(problem.testCases)) {
              const testCasesDiv = document.getElementById('test-cases-display');
              const testCasesContent = document.getElementById('test-cases-content');
              
              // Only show non-hidden test cases
              const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
              
              testCasesContent.innerHTML = visibleTestCases.map((tc, index) => \`
                <div class="submission-item" style="margin-bottom: 10px;">
                  <div class="submission-info">
                    <div class="submission-title">Test Case \${index + 1}</div>
                    <div class="submission-meta">
                      <strong>Input:</strong> <code>\${tc.input || 'N/A'}</code><br>
                      <strong>Expected Output:</strong> <code>\${tc.output || 'N/A'}</code>
                    </div>
                  </div>
                </div>
              \`).join('');
              
              testCasesDiv.style.display = 'block';
              
              // Show test results section if problem is selected
              document.getElementById('test-results-section').style.display = 'block';
              updateTestResultsDisplay();
            } else {
              document.getElementById('test-cases-display').style.display = 'none';
              document.getElementById('test-results-section').style.display = 'none';
            }
          }

          function resetTestResults() {
            lastTestResults = null;
            updateTestResultsDisplay();
            document.getElementById('submit-solution-btn').disabled = false;
          }

          function updateTestResultsDisplay() {
            if (!currentProblem || !currentProblem.testCases) return;
            
            const visibleTestCases = currentProblem.testCases.filter(tc => !tc.isHidden);
            const testDotsContainer = document.getElementById('test-dots');
            const testCasesResults = document.getElementById('test-cases-results');
            const testSummaryStatus = document.getElementById('test-summary-status');
            
            if (!lastTestResults) {
              // Show pending state
              testDotsContainer.innerHTML = visibleTestCases.map(() => 
                '<div class="test-dot pending"></div>'
              ).join('');
              testSummaryStatus.textContent = 'Ready to test';
              testSummaryStatus.className = 'test-summary-status not-run';
              testCasesResults.innerHTML = '';
              return;
            }
            
            // Parse test results and match with visible test cases
            const results = lastTestResults;
            let passedCount = 0;
            
            // Create dots
            const dots = visibleTestCases.map((tc, index) => {
              const testResult = results.find(r => r.testCase === tc._id);
              if (testResult && testResult.status === 'passed') {
                passedCount++;
                return '<div class="test-dot passed"></div>';
              } else if (testResult) {
                return '<div class="test-dot failed"></div>';
              } else {
                return '<div class="test-dot pending"></div>';
              }
            }).join('');
            
            testDotsContainer.innerHTML = dots;
            
            // Update summary status
            if (passedCount === visibleTestCases.length) {
              testSummaryStatus.textContent = \`All tests passed (\${passedCount}/\${visibleTestCases.length})\`;
              testSummaryStatus.className = 'test-summary-status all-passed';
              document.getElementById('submit-solution-btn').disabled = false;
            } else {
              testSummaryStatus.textContent = \`\${passedCount}/\${visibleTestCases.length} tests passed\`;
              testSummaryStatus.className = 'test-summary-status some-failed';
              document.getElementById('submit-solution-btn').disabled = false;
            }
            
            // Show detailed results
            testCasesResults.innerHTML = visibleTestCases.map((tc, index) => {
              const testResult = results.find(r => r.testCase === tc._id);
              const status = testResult ? testResult.status : 'pending';
              
              return \`
                <div class="test-case-item">
                  <div class="test-case-status \${status}"></div>
                  <div class="test-case-info">
                    <div class="test-case-title">Test Case \${index + 1}</div>
                    <div class="test-case-details">
                      Input: \${tc.input}<br>
                      Expected: \${tc.output}\${testResult ? \`<br>Got: \${testResult.actualOutput}\` : ''}
                    </div>
                  </div>
                </div>
              \`;
            }).join('');
          }

          async function executeCode() {
            if (!isBackendAvailable) {
              document.getElementById('output').textContent = 'Demo mode: Code execution requires backend services to be running.';
              return;
            }
            
            const problemId = document.getElementById('problemId').value;
            const language = document.getElementById('language').value;
            const code = document.getElementById('code').value;
            const outputElement = document.getElementById('output');
            const runBtn = document.getElementById('run-btn');
            const executionInfo = document.getElementById('execution-info');

            if (!code.trim()) {
              outputElement.textContent = 'Please write some code first.';
              return;
            }

            if (!problemId) {
              outputElement.textContent = 'Please select a problem first.';
              return;
            }

            if (!currentProblem || !currentProblem.testCases) {
              outputElement.textContent = 'Problem data not loaded properly. Please refresh the page.';
              return;
            }

            if (isExecuting) return;

            isExecuting = true;
            runBtn.textContent = '⏳ Running...';
            runBtn.disabled = true;
            outputElement.textContent = 'Executing code...';
            executionInfo.style.display = 'none';

            try {
              const response = await fetch('${API_BASE}/execute', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ${STATIC_TOKEN}'
                },
                body: JSON.stringify({
                  code: code,
                  language: language,
                  problemId: problemId
                })
              });

              const result = await response.json();
              
              if (!response.ok) {
                throw new Error(result.message || 'Request failed');
              }
              
              // Parse the output to extract test results
              const output = result.output || '';
              const lines = output.split('\\n');
              const testResults = [];
              
              // Parse test results from output
              lines.forEach(line => {
                const match = line.match(/Test (\\d+) - Output: (.+?), Expected: (.+)/);
                if (match) {
                  const testNum = parseInt(match[1]);
                  const actualOutput = match[2];
                  const expectedOutput = match[3];
                  const visibleTestCases = currentProblem.testCases.filter(tc => !tc.isHidden);
                  
                  if (testNum <= visibleTestCases.length) {
                    const testCase = visibleTestCases[testNum - 1];
                    if (testCase) {
                      testResults.push({
                        testCase: testCase._id,
                        actualOutput: actualOutput,
                        status: actualOutput.trim() === expectedOutput.trim() ? 'passed' : 'failed'
                      });
                    }
                  }
                }
              });
              
              lastTestResults = testResults;
              updateTestResultsDisplay();
              
              // Show console output
              if (result.error && result.error.trim()) {
                outputElement.textContent = \`Error: \${result.error}\`;
              } else if (output) {
                outputElement.textContent = output;
              } else {
                outputElement.textContent = 'No output received';
              }
              
              // Show execution info
              if (result.executionTime || result.memoryUsed) {
                executionInfo.innerHTML = \`
                  <strong>Execution Stats:</strong><br>
                  Time: \${result.executionTime || 0}ms<br>
                  Memory: \${result.memoryUsed || 0}KB
                \`;
                executionInfo.style.display = 'block';
              }

            } catch (error) {
              console.error('Execution error:', error);
              outputElement.textContent = \`Error: \${error.message}\`;
              resetTestResults();
            } finally {
              isExecuting = false;
              runBtn.textContent = '🚀 Run Code';
              runBtn.disabled = false;
            }
          }

          async function submitSolution() {
            if (!isBackendAvailable) {
              alert('Demo mode: Solution submission requires backend services to be running.');
              return;
            }
            
            const problemId = document.getElementById('problemId').value;
            const language = document.getElementById('language').value;
            const code = document.getElementById('code').value;
            const submitBtn = document.getElementById('submit-solution-btn');

            if (!code.trim() || !problemId) {
              alert('Please select a problem and write some code first.');
              return;
            }

            if (!currentProblem || !currentProblem.testCases) {
              alert('Problem data not loaded properly. Please refresh the page.');
              return;
            }

            // Require all visible test cases to pass before submitting
            if (!lastTestResults || lastTestResults.filter(r => r.status === 'passed').length !== currentProblem.testCases.filter(tc => !tc.isHidden).length) {
              alert('Please run and pass all visible test cases before submitting.');
              return;
            }

            submitBtn.disabled = false;
            submitBtn.textContent = '📤 Submitting...';

            try {
              const response = await fetch('${API_BASE}/submit', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ${STATIC_TOKEN}'
                },
                body: JSON.stringify({
                  problemId: problemId,
                  code: code,
                  language: language
                })
              });

              const result = await response.json();
              
              if (response.ok) {
                alert(\`Solution submitted successfully! Submission ID: \${result.data.submissionId || 'N/A'}\`);
                // Optionally redirect to submissions page
                window.location.href = '/submissions';
              } else {
                throw new Error(result.message || 'Submission failed');
              }

            } catch (error) {
              console.error('Submission error:', error);
              alert(\`Submission failed: \${error.message}\`);
            } finally {
              submitBtn.disabled = false;
              submitBtn.textContent = '📤 Submit Solution';
            }
          }

          // Event listeners
          document.getElementById('problemId').addEventListener('change', updateCodeEditor);
          document.getElementById('language').addEventListener('change', updateCodeEditor);
          
          // Initialize page
          document.addEventListener('DOMContentLoaded', function() {
            showTab('submit');
            updateCodeEditor();
          });
        </script>
      </body>
      </html>
    `);
  } catch (e) {
    console.error('Error in home route:', e);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Code Platform</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Error</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error loading page: ${e.response?.data?.message || e.message}
            </div>
            <a href="/" class="btn">🔄 Try Again</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// View problem details with test cases
app.get('/problem/:id', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    
    // Fetch problem details and test cases in parallel
    const [problemRes, testCasesRes] = await Promise.all([
      axios.get(`${API_PROBLEMS_BASE}/${req.params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetchTestCases(req.params.id, token)
    ]);
    
    const problem = problemRes.data.data;
    const testCases = testCasesRes;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${problem.title} - Problem Details</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📖 ${problem.title}</h1>
            <p>Difficulty: <span class="status status-${problem.difficulty}">${problem.difficulty}</span></p>
          </div>
          <div class="content">
            <div class="form-group">
              <h3>Description</h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; white-space: pre-wrap;">${problem.description}</div>
            </div>
            
            ${problem.tags && problem.tags.length > 0 ? `
              <div class="form-group">
                <h3>Tags</h3>
                <div>
                  ${problem.tags.map(tag => `<span class="status status-pending" style="margin: 5px;">${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${testCases && testCases.length > 0 ? `
              <div class="form-group">
                <h3>Test Cases (${testCases.length} total)</h3>
                ${testCases.filter(tc => !tc.isHidden).map((tc, index) => `
                  <div class="submission-item" style="margin-bottom: 10px;">
                    <div class="submission-info">
                      <div class="submission-title">Test Case ${index + 1}</div>
                      <div class="submission-meta">
                        <strong>Input:</strong> ${tc.input}<br>
                        <strong>Expected Output:</strong> ${tc.output}
                      </div>
                    </div>
                  </div>
                `).join('')}
                ${testCases.filter(tc => tc.isHidden).length > 0 ? 
                  `<p style="color: #666; margin-top: 10px;">+ ${testCases.filter(tc => tc.isHidden).length} hidden test cases</p>` : ''
                }
              </div>
            ` : '<p style="color: #666;">No test cases available for this problem.</p>'}
            
            <div class="nav-links">
              <a href="/" class="btn">🔙 Back to Home</a>
              <a href="/edit-problem/${problem._id}" class="btn btn-secondary">✏️ Edit Problem</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    console.error('Error fetching problem details:', e);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problem Not Found</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Problem Not Found</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/" class="btn">🔙 Back to Home</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Keep all other routes the same...
// (Handle problem creation, edit problem page, update problem, submit, list submissions, view submission details, fetch code template, registration pages)

// Handle problem creation
app.post('/create-problem', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const { 
      title, 
      description, 
      difficulty, 
      tags, 
      testCases,
      'functionSignature-cpp': cppSignature,
      'functionSignature-python': pythonSignature,
      'functionSignature-java': javaSignature
    } = req.body;

    // Parse tags and test cases
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    let testCasesArray;
    try {
      testCasesArray = JSON.parse(testCases);
      if (!Array.isArray(testCasesArray)) throw new Error('Test cases must be an array');
      testCasesArray = testCasesArray.map(tc => {
        if (typeof tc === 'string') {
          try {
            tc = JSON.parse(tc);
          } catch {
            tc = {};
          }
        }
        return {
          input: typeof tc.input === 'string' ? tc.input : "",
          output: typeof tc.output === 'string' ? tc.output : "",
          isHidden: !!tc.isHidden
        };
      });
    } catch (err) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Problem Creation Error</title>
          ${getStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Problem Creation Failed</h1>
            </div>
            <div class="content">
              <div class="error-message">
                Invalid test cases format: ${err.message}
              </div>
              <a href="/" class="btn">🔙 Go Back</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    // Prepare function signatures
    const functionSignatures = {};
    if (cppSignature) functionSignatures.cpp = cppSignature;
    if (pythonSignature) functionSignatures.python = pythonSignature;
    if (javaSignature) functionSignatures.java = javaSignature;

    // Create the problem with function signatures
    const result = await axios.post(`${API_PROBLEMS_BASE}`, {
      title,
      description,
      difficulty,
      tags: tagsArray,
      testCases: testCasesArray,
      functionSignatures
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const created = result.data.data;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problem Created</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Problem Created Successfully!</h1>
          </div>
          <div class="content">
            <div class="success-message">
              Problem "${title}" has been created successfully!<br>
              Problem ID: <strong>${created._id}</strong><br>
              Test cases created: <strong>${testCasesArray ? testCasesArray.length : 0}</strong><br>
              Function signatures: <strong>${Object.keys(functionSignatures).join(', ')}</strong>
            </div>
            <div class="nav-links">
              <a href="/" class="btn">🔄 Back to Home</a>
              <a href="/problem/${created._id}" class="btn btn-secondary">👀 View Problem</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problem Creation Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Problem Creation Failed</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/register" class="btn">🔙 Go Back</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Edit problem page
app.get('/edit-problem/:id', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const [problemRes, testCasesRes] = await Promise.all([
      axios.get(`${API_PROBLEMS_BASE}/${req.params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetchTestCases(req.params.id, token)
    ]);
    
    const problem = problemRes.data.data;
    const testCases = testCasesRes;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit ${problem.title}</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✏️ Edit Problem</h1>
            <p>Update problem details and test cases</p>
          </div>
          <div class="content">
            <form method="POST" action="/update-problem/${problem._id}">
              <div class="grid">
                <div class="form-group">
                  <label for="title">Problem Title</label>
                  <input type="text" id="title" name="title" required value="${problem.title}" />
                </div>
                <div class="form-group">
                  <label for="difficulty">Difficulty</label>
                  <select id="difficulty" name="difficulty" required>
                    <option value="easy" ${problem.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                    <option value="medium" ${problem.difficulty === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="hard" ${problem.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="description">Problem Description</label>
                <textarea id="description" name="description" rows="6" required>${problem.description}</textarea>
              </div>
              <div class="form-group">
                <label for="tags">Tags (comma-separated)</label>
                <input type="text" id="tags" name="tags" value="${(problem.tags || []).join(', ')}" />
              </div>
              <div class="form-group">
                <label for="testCases">Test Cases (JSON format)</label>
                <textarea id="testCases" name="testCases" rows="8" required>${JSON.stringify(testCases || [], null, 2)}</textarea>
              </div>
              <div class="form-group">
                <label for="templates">Templates (per language, JSON)</label>
                <textarea id="templates" name="templates" rows="8" required>${JSON.stringify(problem.templates || {}, null, 2)}</textarea>
              </div>
              <button type="submit" class="btn btn-success">💾 Update Problem</button>
              <a href="/problem/${problem._id}" class="btn btn-secondary">❌ Cancel</a>
            </form>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Edit Problem Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Error</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error loading problem: ${e.response?.data?.message || e.message}
            </div>
            <a href="/" class="btn">🔙 Back to Home</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Handle problem update
app.post('/update-problem/:id', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const { title, description, difficulty, tags, testCases, templates } = req.body;
    
    // Parse tags and test cases
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const testCasesArray = JSON.parse(testCases);
    
    // Parse templates
    let templatesObj;
    try {
      templatesObj = JSON.parse(templates);
      if (typeof templatesObj !== 'object' || Array.isArray(templatesObj)) throw new Error('Templates must be a JSON object');
    } catch (err) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Template Parse Error</title>
          ${getStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Template Parse Error</h1>
            </div>
            <div class="content">
              <div class="error-message">
                Invalid templates format: ${err.message}
              </div>
              <a href="/edit-problem/${req.params.id}" class="btn">🔙 Go Back</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    await axios.put(`${API_PROBLEMS_BASE}/${req.params.id}`, {
      title,
      description,
      difficulty,
      tags: tagsArray,
      testCases: testCasesArray,
      templates: templatesObj
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problem Updated</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Problem Updated Successfully!</h1>
          </div>
          <div class="content">
            <div class="success-message">
              Problem "${title}" has been updated successfully!
            </div>
            <div class="nav-links">
              <a href="/problem/${req.params.id}" class="btn">👀 View Problem</a>
              <a href="/" class="btn btn-secondary">🏠 Back to Home</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problem Update Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Update Failed</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/edit-problem/${req.params.id}" class="btn">🔙 Go Back</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// ...existing code...

app.post('/submit', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const { problemId, code, language } = req.body;
    const result = await axios.post(`${API_BASE}/submit`, { problemId, code, language }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Submission Success</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Submission Successful!</h1>
          </div>
          <div class="content">
            <div class="success-message">
              Your code has been submitted successfully!<br>
              Submission ID: <strong>${result.data.data.submissionId || 'N/A'}</strong>
            </div>
            <div class="nav-links">
              <a href="/" class="btn">🔄 Submit Another</a>
              <a href="/submissions" class="btn btn-secondary">📋 View All Submissions</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Submission Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Submission Failed</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/" class="btn">🔙 Go Back</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// List submissions
app.get('/submissions', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const result = await axios.get(`${API_BASE}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const subs = result.data.data.submissions;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Submissions</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 My Submissions</h1>
            <p>Track your coding progress and results</p>
          </div>
          <div class="content">
            ${subs.length === 0 ? 
              '<div class="error-message">No submissions found. <a href="/">Submit your first solution!</a></div>' :
              `<ul class="submissions-list">
                ${subs.map(s => `
                  <li class="submission-item">
                    <div class="submission-info">
                      <div class="submission-title">${s.problem?.title || s.problem}</div>
                      <div class="submission-meta">
                        Language: ${s.language} • 
                        Status: <span class="status status-${s.status.toLowerCase()}">${s.status}</span>
                      </div>
                    </div>
                    <a href="/submission/${s._id}" class="btn">👀 View Details</a>
                  </li>
                `).join('')}
              </ul>`
            }
            <div class="nav-links">
              <a href="/" class="btn">🔙 Back to Home</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Submissions</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Error</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error loading submissions: ${e.response?.data?.message || e.message}
            </div>
            <a href="/" class="btn">🔙 Go Back</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// View submission details
app.get('/submission/:id', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const result = await axios.get(`${API_BASE}/submission/${req.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Try to fetch detailed results (for time complexity, etc.)
    let details = null;
    try {
      const detailsRes = await axios.get(`${API_BASE}/submission/${req.params.id}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      details = detailsRes.data.data;
    } catch (e) {
      // Ignore if not available
      details = null;
    }

    // Extract summary info
    const submission = result.data.data;
    let verdict = submission.status || submission.overallResult?.verdict || 'UNKNOWN';
    let totalTime = submission.overallResult?.totalExecutionTime;
    let timeComplexity = submission.complexityAnalysis?.timeComplexity?.estimated || details?.complexityAnalysis?.timeComplexity?.estimated;
    let timeComplexityAnalysis = submission.complexityAnalysis?.timeComplexity?.analysis || details?.complexityAnalysis?.timeComplexity?.analysis;

    // Process test case results - check both possible locations
    const testCaseResults = submission.executionResults || submission.testCaseResults || [];
    const passedTests = testCaseResults.filter(test => test.status === 'passed' || test.status === 'PASSED');
    const failedTests = testCaseResults.filter(test => test.status === 'failed' || test.status === 'FAILED');
    const totalTests = testCaseResults.length;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Submission Details</title>
        ${getStyles()}
        <style>
          .json-container {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.6;
            overflow-x: auto;
            margin: 20px 0;
          }
          .json-key {
            color: #63b3ed;
          }
          .json-string {
            color: #68d391;
          }
          .json-number {
            color: #f6ad55;
          }
          .json-boolean {
            color: #fc8181;
          }
          .json-null {
            color: #a0aec0;
          }
          .test-case-summary {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3182ce;
          }
          .test-case-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .test-case-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .test-case-card.passed {
            border-left: 4px solid #48bb78;
          }
          .test-case-card.failed {
            border-left: 4px solid #f56565;
          }
          .test-case-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .test-case-number {
            font-weight: 600;
            color: #2d3748;
          }
          .test-case-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .test-case-status.passed {
            background: #c6f6d5;
            color: #22543d;
          }
          .test-case-status.failed {
            background: #fed7d7;
            color: #742a2a;
          }
          .test-case-details {
            font-size: 14px;
            color: #4a5568;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          .tab {
            display: inline-block;
            padding: 10px 20px;
            margin-right: 10px;
            background: #e2e8f0;
            color: #4a5568;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .tab.active {
            background: #3182ce;
            color: white;
          }
          .tab-content {
            display: none;
            padding: 20px 0;
          }
          .tab-content.active {
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Submission Details</h1>
            <p>Review your solution and test results</p>
          </div>
          <div class="content">
            <div class="test-case-summary">
              <h3>📊 Submission Summary</h3>
              <div class="grid">
                <div>
                  <strong>Problem:</strong> ${submission.problem?.title || submission.problemId || 'Unknown'}<br>
                  <strong>Language:</strong> ${submission.language}<br>
                  <strong>Status:</strong> <span class="status status-${verdict.toLowerCase()}">${verdict}</span>
                </div>
                <div>
                  ${totalTests > 0 ? `<strong>Tests:</strong> ${passedTests.length}/${totalTests} passed<br>` : ''}
                  ${totalTime ? `<strong>Total Time:</strong> ${totalTime}ms<br>` : ''}
                  ${timeComplexity ? `<strong>Time Complexity:</strong> ${timeComplexity}<br>` : ''}
                </div>
              </div>
              ${timeComplexityAnalysis ? `
                <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 6px;">
                  <strong>Analysis:</strong> ${timeComplexityAnalysis}
                </div>
              ` : ''}
            </div>
            <div>
              <div class="tab active" onclick="showTab('overview')">📊 Overview</div>
              <div class="tab" onclick="showTab('code')">💻 Code</div>
              <div class="tab" onclick="showTab('tests')">🧪 Test Results</div>
              <div class="tab" onclick="showTab('json')">📋 Raw Data</div>
            </div>
            <div id="overview-tab" class="tab-content active">
              <h4>Submission Overview</h4>
              <div class="code-display">
                <strong>Problem:</strong> ${submission.problem?.title || submission.problemId || 'Unknown'}<br>
                <strong>Language:</strong> ${submission.language}<br>
                <strong>Status:</strong> ${verdict}<br>
                <strong>Submitted:</strong> ${submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'Unknown'}<br>
                ${submission.userId ? `<strong>User:</strong> ${submission.userId}<br>` : ''}
                ${submission._id ? `<strong>Submission ID:</strong> ${submission._id}` : ''}
              </div>
            </div>
            <div id="code-tab" class="tab-content">
              <h4>Your Solution</h4>
              <div class="code-display">
                ${submission.code || 'No code available'}
              </div>
            </div>
            <div id="tests-tab" class="tab-content">
              <h4>Test Case Results</h4>
              ${testCaseResults.length > 0 ? `
                <div class="test-case-grid">
                  ${testCaseResults.map((test, index) => `
                    <div class="test-case-card ${test.status === 'passed' || test.status === 'PASSED' ? 'passed' : 'failed'}">
                      <div class="test-case-header">
                        <div class="test-case-number">Test Case ${index + 1}</div>
                        <div class="test-case-status ${test.status === 'passed' || test.status === 'PASSED' ? 'passed' : 'failed'}">
                          ${test.status}
                        </div>
                      </div>
                      <div class="test-case-details">
                        ${test.input ? `<strong>Input:</strong> ${test.input}<br>` : ''}
                        ${test.expectedOutput ? `<strong>Expected:</strong> ${test.expectedOutput}<br>` : ''}
                        ${test.actualOutput ? `<strong>Your Output:</strong> ${test.actualOutput}<br>` : ''}
                        ${test.executionTime ? `<strong>Time:</strong> ${test.executionTime}ms<br>` : ''}
                        ${test.memoryUsed ? `<strong>Memory:</strong> ${test.memoryUsed}KB<br>` : ''}
                        ${test.error ? `<strong>Error:</strong> ${test.error}` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : '<p style="text-align: center; color: #718096; margin: 40px 0;">No test case results available</p>'}
            </div>
            <div id="json-tab" class="tab-content">
              <div class="json-container">
                <pre id="json-display">${JSON.stringify(submission, null, 2)}</pre>
              </div>
            </div>
            <div class="nav-links">
              <a href="/submissions" class="btn">🔙 Back to Submissions</a>
              <a href="/" class="btn btn-secondary">🏠 Home</a>
            </div>
          </div>
        </div>

        <script>
          function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(content => {
              content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
              tab.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
            if (tabName === 'json') {
              highlightJson();
            }
          }
          function highlightJson() {
            const jsonDisplay = document.getElementById('json-display');
            let jsonText = jsonDisplay.textContent;
            jsonText = jsonText
              .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
              .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
              .replace(/: (\\d+)/g, ': <span class="json-number">$1</span>')
              .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
              .replace(/: null/g, ': <span class="json-null">null</span>');
            jsonDisplay.innerHTML = jsonText;
          }
          document.addEventListener('DOMContentLoaded', function() {
            highlightJson();
          });
        </script>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Submission Details</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Error</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error loading submission: ${e.response?.data?.message || e.message}
            </div>
            <a href="/submissions" class="btn">🔙 Back to Submissions</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Fetch code template for a problem
app.get('/code-template/:problemId/:language', requireAuth, async (req, res) => {
  try {
    const token = getToken();
    const result = await axios.get(`${API_BASE}/template/${req.params.problemId}/${req.params.language}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.message || e.message });
  }
});

// Registration form
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register - Code Platform</title>
      ${getStyles()}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Register</h1>
          <p>Create your account to start coding</p>
        </div>
        <div class="content">
          <form method="POST" action="/register">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="btn btn-success">✨ Create Account</button>
          </form>
          <div class="nav-links">
            <a href="/login" class="btn btn-secondary">📝 Already have an account? Login</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await axios.post(`${API_BASE}/register`, { username, email, password });
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Success</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Registration Successful!</h1>
          </div>
          <div class="content">
            <div class="success-message">
              Account created successfully! You can now start coding.
            </div>
            <div class="nav-links">
              <a href="/" class="btn">🏠 Go to Home</a>
              <a href="/login" class="btn btn-secondary">📝 Login</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Registration Failed</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/register" class="btn">🔙 Go Back</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Login form
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - Code Platform</title>
      ${getStyles()}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Login</h1>
          <p>Access your coding dashboard</p>
        </div>
        <div class="content">
          <form method="POST" action="/login">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="btn btn-success">🚀 Login</button>
          </form>
          <div class="nav-links">
            <a href="/register" class="btn btn-secondary">✨ Don't have an account? Register</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await axios.post(`${API_BASE}/login`, { email, password });
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Success</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Login Successful!</h1>
          </div>
          <div class="content">
            <div class="success-message">
              Welcome back! You can now start coding.
            </div>
            <div class="nav-links">
              <a href="/" class="btn">🏠 Go to Home</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (e) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Error</title>
        ${getStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Login Failed</h1>
          </div>
          <div class="content">
            <div class="error-message">
              Error: ${e.response?.data?.message || e.message}
            </div>
            <a href="/login" class="btn">🔙 Try Again</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the platform`);
});