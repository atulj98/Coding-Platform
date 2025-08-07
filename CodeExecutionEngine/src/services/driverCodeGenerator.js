class DriverCodeGenerator {
  constructor() {
    this.languageGenerators = {
      'cpp': this.generateCppDriver.bind(this),
      'c++': this.generateCppDriver.bind(this),
      'c': this.generateCDriver.bind(this),
      'python': this.generatePythonDriver.bind(this),
      'py': this.generatePythonDriver.bind(this),
      'java': this.generateJavaDriver.bind(this),
      'javascript': this.generateJavaScriptDriver.bind(this),
      'js': this.generateJavaScriptDriver.bind(this)
    };
  }

  // Check if order matters based on problem description
  checkIfOrderMatters(description = '') {
    const orderAgnosticPhrases = [
      'any order',
      'in any order', 
      'order does not matter',
      'order doesn\'t matter',
      'regardless of order'
    ];
    return !orderAgnosticPhrases.some(phrase => 
      description.toLowerCase().includes(phrase)
    );
  }

  // Main entry point: dispatch based on language
  generate(language, functionSignature, testCases, userCode, description = '') {
    const orderMatters = this.checkIfOrderMatters(description);
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return this.generateJavaScriptDriver(functionSignature, testCases, userCode, orderMatters);
      case 'java':
        return this.generateJavaDriver(functionSignature, testCases, userCode, orderMatters);
      case 'cpp':
      case 'c++':
        return this.generateCppDriver(functionSignature, testCases, userCode, orderMatters, description);
      case 'c':
        return this.generateCDriver(functionSignature, testCases, userCode, orderMatters);
      case 'python':
      case 'py':
        return this.generatePythonDriver(functionSignature, testCases, userCode, orderMatters);
      default:
        throw new Error(`Driver code generation not supported for language: ${language}`);
    }
  }

  // Helper to parse function signature for C++/Python
  parseFunctionSignature(signature, lang) {
    if (lang === 'cpp') {
      // Example: vector<vector<string>> solveNQueens(int n)
      const match = signature.match(/^([^\s]+)\s+(\w+)\s*\(([^)]*)\)/);
      if (!match) throw new Error('Invalid C++ function signature');
      const returnType = match[1];
      const functionName = match[2];
      const params = match[3].split(',').map(p => {
        const parts = p.trim().split(/\s+/);
        return { type: parts.slice(0, -1).join(' '), name: parts[parts.length - 1] };
      }).filter(p => p.name);
      return { functionName, returnType, parameters: params };
    } else if (lang === 'python') {
      const match = signature.match(/^def\s+(\w+)\s*\(([^)]*)\)/);
      if (!match) throw new Error('Invalid Python function signature');
      const functionName = match[1];
      const params = match[2].split(',').map(p => ({ name: p.trim() })).filter(p => p.name);
      return { functionName, returnType: null, parameters: params };
    }
    throw new Error('Unsupported language for signature parsing');
  }

  // Robust test input parser for LeetCode style
  parseTestInput(input) {
    if (typeof input !== 'string') return [input];
    // Try JSON parse for arrays/objects
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return [parsed];
      return [parsed];
    } catch (e) {
      if (input.includes('\n')) {
        return input.split('\n').map(s => s.trim()).filter(Boolean).map(s => {
          try { return JSON.parse(s); } catch { return s; }
        });
      }
      if (input.includes(',')) {
        return input.split(',').map(s => s.trim()).filter(Boolean).map(s => {
          try { return JSON.parse(s); } catch { return s; }
        });
      }
      return [input.trim()];
    }
  }

  formatPythonValue(value) {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return JSON.stringify(parsed);
      } catch {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
    }
    if (Array.isArray(value)) return JSON.stringify(value);
    return String(value);
  }

  generateCDriver(functionSignature, testCases, userCode, orderMatters = true) {
    try {
      // Parse function signature for C
      const match = functionSignature.match(/^([^\s]+)\s+(\w+)\s*\(([^)]*)\)/);
      if (!match) throw new Error('Invalid C function signature');
      
      const returnType = match[1];
      const functionName = match[2];
      const params = match[3].split(',').map(p => {
        const parts = p.trim().split(/\s+/);
        return { type: parts.slice(0, -1).join(' '), name: parts[parts.length - 1] };
      }).filter(p => p.name);

      const escapeString = (str) => {
        return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      };

      let driverCode = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <math.h>

// Helper function to parse 2D integer array from string
int** parse2DIntArray(const char* s, int* returnSize, int** returnColumnSizes) {
    if (!s || strcmp(s, "[]") == 0 || strcmp(s, "null") == 0) {
        *returnSize = 0;
        *returnColumnSizes = NULL;
        return NULL;
    }
    
    // Count rows by counting '[' characters (excluding the outer ones)
    int rowCount = 0;
    for (int i = 1; i < strlen(s) - 1; i++) {
        if (s[i] == '[') rowCount++;
    }
    
    if (rowCount == 0) {
        *returnSize = 0;
        *returnColumnSizes = NULL;
        return NULL;
    }
    
    int** result = (int**)malloc(rowCount * sizeof(int*));
    *returnColumnSizes = (int*)malloc(rowCount * sizeof(int));
    *returnSize = rowCount;
    
    // Parse each row
    char* temp = strdup(s);
    char* ptr = temp + 1; // Skip first '['
    int rowIndex = 0;
    
    while (*ptr && rowIndex < rowCount) {
        if (*ptr == '[') {
            ptr++; // Skip '['
            char* rowStart = ptr;
            
            // Find end of this row
            while (*ptr && *ptr != ']') ptr++;
            *ptr = '\\0'; // Null terminate the row
            
            // Count numbers in this row
            int colCount = 0;
            char* rowCopy = strdup(rowStart);
            char* token = strtok(rowCopy, ",");
            while (token) {
                colCount++;
                token = strtok(NULL, ",");
            }
            free(rowCopy);
            
            // Parse numbers
            result[rowIndex] = (int*)malloc(colCount * sizeof(int));
            (*returnColumnSizes)[rowIndex] = colCount;
            
            rowCopy = strdup(rowStart);
            token = strtok(rowCopy, ",");
            int colIndex = 0;
            while (token && colIndex < colCount) {
                result[rowIndex][colIndex] = atoi(token);
                colIndex++;
                token = strtok(NULL, ",");
            }
            free(rowCopy);
            rowIndex++;
            ptr++; // Skip past ']'
        } else {
            ptr++;
        }
    }
    
    free(temp);
    return result;
}

// Helper function to parse 1D integer array
int* parseIntArray(const char* s, int* returnSize) {
    if (!s || strcmp(s, "[]") == 0 || strcmp(s, "null") == 0) {
        *returnSize = 0;
        return NULL;
    }
    
    // Count numbers
    int count = 0;
    char* temp = strdup(s + 1); // Skip first '['
    temp[strlen(temp) - 1] = '\\0'; // Remove last ']'
    
    char* token = strtok(temp, ",");
    while (token) {
        count++;
        token = strtok(NULL, ",");
    }
    
    if (count == 0) {
        *returnSize = 0;
        free(temp);
        return NULL;
    }
    
    int* result = (int*)malloc(count * sizeof(int));
    *returnSize = count;
    
    // Parse again
    free(temp);
    temp = strdup(s + 1);
    temp[strlen(temp) - 1] = '\\0';
    
    token = strtok(temp, ",");
    int index = 0;
    while (token && index < count) {
        result[index] = atoi(token);
        index++;
        token = strtok(NULL, ",");
    }
    
    free(temp);
    return result;
}

// Helper function to sort string array (for order-agnostic comparison)
void sortStringArray(char** arr, int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (strcmp(arr[j], arr[j + 1]) > 0) {
                char* temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// Helper function to print 2D array
void print2DArray(int** arr, int rows, int* colSizes) {
    printf("[");
    for (int i = 0; i < rows; i++) {
        if (i > 0) printf(",");
        printf("[");
        for (int j = 0; j < colSizes[i]; j++) {
            if (j > 0) printf(",");
            printf("%d", arr[i][j]);
        }
        printf("]");
    }
    printf("]");
}

// Helper function to print 1D array
void printArray(int* arr, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        if (i > 0) printf(",");
        printf("%d", arr[i]);
    }
    printf("]");
}

// User's solution code
${userCode}

// FIXED: Ensure main function is properly defined
int main() {
    printf("Starting C driver tests...\\n");
    bool orderMatters = ${orderMatters ? 'true' : 'false'};
`;

      testCases.forEach((tc, idx) => {
        let argDecls = '';
        let callArgs = [];
        let cleanupCode = '';
        let inputVals = this.parseTestInput(tc.input);

        params.forEach((param, i) => {
          let argName = `arg${idx}_${i}`;
          let val = inputVals[i] !== undefined ? inputVals[i] : '';
          let valStr = typeof val === 'string' ? val : JSON.stringify(val);

          if (param.type.includes('int**') || param.type.includes('int*[]')) {
            // 2D array
            let sizeName = `${argName}Size`;
            let colSizeName = `${argName}ColSize`;
            argDecls += `    int ${sizeName};\n`;
            argDecls += `    int* ${colSizeName};\n`;
            argDecls += `    int** ${argName} = parse2DIntArray("${escapeString(valStr)}", &${sizeName}, &${colSizeName});\n`;
            callArgs.push(argName);
            
            // Add size parameter if it exists in function signature
            if (params.find(p => p.name.toLowerCase().includes('size'))) {
              callArgs.push(sizeName);
            }
            if (params.find(p => p.name.toLowerCase().includes('colsize') || p.name.toLowerCase().includes('columnsizes'))) {
              callArgs.push(colSizeName);
            }
            
            cleanupCode += `    if (${argName}) {\n`;
            cleanupCode += `        for (int i = 0; i < ${sizeName}; i++) free(${argName}[i]);\n`;
            cleanupCode += `        free(${argName});\n`;
            cleanupCode += `        free(${colSizeName});\n`;
            cleanupCode += `    }\n`;
          } else if (param.type.includes('int*')) {
            // 1D array
            let sizeName = `${argName}Size`;
            argDecls += `    int ${sizeName};\n`;
            argDecls += `    int* ${argName} = parseIntArray("${escapeString(valStr)}", &${sizeName});\n`;
            callArgs.push(argName);
            
            if (params.find(p => p.name.toLowerCase().includes('size'))) {
              callArgs.push(sizeName);
            }
            
            cleanupCode += `    if (${argName}) free(${argName});\n`;
          } else if (param.type.includes('int')) {
            argDecls += `    int ${argName} = ${val};\n`;
            callArgs.push(argName);
          } else if (param.type.includes('char*')) {
            argDecls += `    char* ${argName} = "${escapeString(val)}";\n`;
            callArgs.push(argName);
          } else if (param.type.includes('bool')) {
            argDecls += `    bool ${argName} = ${val ? 'true' : 'false'};\n`;
            callArgs.push(argName);
          } else {
            argDecls += `    // TODO: Handle ${param.type} ${argName}\n`;
          }
        });

        let callExpr;
        let outputExpr;
        
        if (returnType === 'void') {
          callExpr = `    ${functionName}(${callArgs.join(', ')});\n`;
          outputExpr = `    printf("Test ${idx + 1} - Output: void function executed, Expected: ${escapeString(tc.output)}\\n");\n`;
        } else if (returnType.includes('int*')) {
          // Return array - need return size
          let retSizeName = `retSize${idx}`;
          argDecls += `    int ${retSizeName};\n`;
          callExpr = `    int* result${idx} = ${functionName}(${callArgs.join(', ')}, &${retSizeName});\n`;
          outputExpr = `    printf("Test ${idx + 1} - Output: ");\n`;
          outputExpr += `    printArray(result${idx}, ${retSizeName});\n`;
          outputExpr += `    printf(", Expected: ${escapeString(tc.output)}\\n");\n`;
          cleanupCode += `    if (result${idx}) free(result${idx});\n`;
        } else {
          callExpr = `    ${returnType} result${idx} = ${functionName}(${callArgs.join(', ')});\n`;
          if (returnType.includes('int') || returnType.includes('bool')) {
            outputExpr = `    printf("Test ${idx + 1} - Output: %d, Expected: ${escapeString(tc.output)}\\n", result${idx});\n`;
          } else {
            outputExpr = `    printf("Test ${idx + 1} - Output: %s, Expected: ${escapeString(tc.output)}\\n", result${idx});\n`;
          }
        }

        driverCode += `\n    // Test ${idx + 1}\n`;
        driverCode += argDecls;
        driverCode += callExpr;
        driverCode += outputExpr;
        driverCode += cleanupCode;
      });

      // FIXED: Properly close main function
      driverCode += `\n    printf("All tests completed.\\n");\n    return 0;\n}\n`;

      return driverCode;
    } catch (error) {
      throw new Error(`Error generating C driver: ${error.message}`);
    }
  }

  // C++ driver: robust for all LeetCode types
// Fixed generateCppDriver method - replace the existing one

generateCppDriver(functionSignature, testCases, userCode, orderMatters = true, description = '') {
  console.log('🔥 DRIVER GENERATOR WORKING 🔥');
  console.log('Descriptionnnnnn:', description);
   if (functionSignature.includes('vector<string>') && (description.includes('in any order') || description.includes('any order') || description.includes('order does not matter') || description.includes('order doesn\'t matter') || description.includes('regardless of order'))) {
    orderMatters = false;
  }
  try {
    const { functionName, returnType, parameters } = this.parseFunctionSignature(functionSignature, 'cpp');

    // Fix user code class structure
    let finalUserCode = userCode.trim();
    if (!finalUserCode.includes('class Solution')) {
      finalUserCode = `class Solution {\npublic:\n${finalUserCode}\n};`;
    }
    
    // Remove duplicate public: declarations
    finalUserCode = finalUserCode.replace(/public:\s*public:/g, 'public:');

    // Helper function to escape strings for C++
    const escapeCppString = (str) => {
      return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    };

    let driverCode = `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>
#include <algorithm>
#include <stdexcept>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <set>
#include <map>
#include <cmath>
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// Enhanced parsing functions
vector<int> parseIntVector(const string& s) {
    vector<int> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    string cleaned = s;
    if (cleaned.front() == '[') cleaned = cleaned.substr(1);
    if (cleaned.back() == ']') cleaned = cleaned.substr(0, cleaned.length() - 1);
    
    if (cleaned.empty()) return result;
    
    stringstream ss(cleaned);
    string item;
    while (getline(ss, item, ',')) {
        item.erase(remove_if(item.begin(), item.end(), ::isspace), item.end());
        if (!item.empty()) {
            try {
                result.push_back(stoi(item));
            } catch (const exception& e) {
                // Skip invalid items
            }
        }
    }
    return result;
}

// 2D integer vector parser
vector<vector<int>> parseVectorVectorInt(const string& s) {
    vector<vector<int>> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    // Remove outer brackets
    string content = s.substr(1, s.length() - 2);
    
    // Find each sub-array
    vector<string> rows;
    string current = "";
    int bracketCount = 0;
    
    for (char c : content) {
        if (c == '[') {
            bracketCount++;
            if (bracketCount == 1) continue; // Skip opening bracket
        } else if (c == ']') {
            bracketCount--;
            if (bracketCount == 0) {
                if (!current.empty()) {
                    rows.push_back(current);
                    current = "";
                }
                continue;
            }
        } else if (c == ',' && bracketCount == 0) {
            continue; // Skip comma between arrays
        }
        
        if (bracketCount > 0) {
            current += c;
        }
    }
    
    // Parse each row as integers
    for (const string& row : rows) {
        vector<int> ints;
        if (!row.empty()) {
            stringstream ss(row);
            string item;
            while (getline(ss, item, ',')) {
                item.erase(remove_if(item.begin(), item.end(), ::isspace), item.end());
                if (!item.empty()) {
                    try {
                        ints.push_back(stoi(item));
                    } catch (const exception& e) {
                        // Skip invalid items
                    }
                }
            }
        }
        result.push_back(ints);
    }
    
    return result;
}

vector<string> parseStringVector(const string& s) {
    vector<string> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    string cleaned = s;
    if (cleaned.front() == '[') cleaned = cleaned.substr(1);
    if (cleaned.back() == ']') cleaned = cleaned.substr(0, cleaned.length() - 1);
    
    if (cleaned.empty()) return result;
    
    stringstream ss(cleaned);
    string item;
    bool inQuotes = false;
    string current = "";
    
    for (char c : cleaned) {
        if (c == '"') {
            inQuotes = !inQuotes;
        } else if (c == ',' && !inQuotes) {
            if (!current.empty()) {
                string trimmed = current;
                trimmed.erase(0, trimmed.find_first_not_of(" \\t"));
                trimmed.erase(trimmed.find_last_not_of(" \\t") + 1);
                if (trimmed.front() == '"' && trimmed.back() == '"') {
                    trimmed = trimmed.substr(1, trimmed.length() - 2);
                }
                result.push_back(trimmed);
            }
            current = "";
        } else {
            current += c;
        }
    }
    
    if (!current.empty()) {
        string trimmed = current;
        trimmed.erase(0, trimmed.find_first_not_of(" \\t"));
        trimmed.erase(trimmed.find_last_not_of(" \\t") + 1);
        if (trimmed.front() == '"' && trimmed.back() == '"') {
            trimmed = trimmed.substr(1, trimmed.length() - 2);
        }
        result.push_back(trimmed);
    }
    
    return result;
}

vector<vector<char>> parseVectorVectorChar(const string& s) {
    vector<vector<char>> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    // Remove outer brackets
    string content = s.substr(1, s.length() - 2);
    
    // Find each sub-array
    vector<string> rows;
    string current = "";
    int bracketCount = 0;
    
    for (char c : content) {
        if (c == '[') {
            bracketCount++;
            if (bracketCount == 1) continue; // Skip opening bracket
        } else if (c == ']') {
            bracketCount--;
            if (bracketCount == 0) {
                if (!current.empty()) {
                    rows.push_back(current);
                    current = "";
                }
                continue;
            }
        } else if (c == ',' && bracketCount == 0) {
            continue; // Skip comma between arrays
        }
        
        if (bracketCount > 0) {
            current += c;
        }
    }
    
    // Parse each row
    for (const string& row : rows) {
        vector<char> chars;
        string item = "";
        bool inQuotes = false;
        
        for (char c : row) {
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                if (!item.empty()) {
                    string trimmed = item;
                    trimmed.erase(remove_if(trimmed.begin(), trimmed.end(), ::isspace), trimmed.end());
                    if (!trimmed.empty()) {
                        chars.push_back(trimmed[0]);
                    }
                }
                item = "";
            } else if (inQuotes || (c != ' ' && c != '\\t')) {
                item += c;
            }
        }
        
        if (!item.empty()) {
            string trimmed = item;
            trimmed.erase(remove_if(trimmed.begin(), trimmed.end(), ::isspace), trimmed.end());
            if (!trimmed.empty()) {
                chars.push_back(trimmed[0]);
            }
        }
        
        result.push_back(chars);
    }
    
    return result;
}

vector<vector<string>> parseVectorVectorString(const string& s) {
    vector<vector<string>> result;
    if (s.empty() || s == "[]" || s == "null") return result;
    
    // Similar parsing logic as parseVectorVectorChar but for strings
    string content = s.substr(1, s.length() - 2);
    
    vector<string> rows;
    string current = "";
    int bracketCount = 0;
    
    for (char c : content) {
        if (c == '[') {
            bracketCount++;
            if (bracketCount == 1) continue;
        } else if (c == ']') {
            bracketCount--;
            if (bracketCount == 0) {
                if (!current.empty()) {
                    rows.push_back(current);
                    current = "";
                }
                continue;
            }
        } else if (c == ',' && bracketCount == 0) {
            continue;
        }
        
        if (bracketCount > 0) {
            current += c;
        }
    }
    
    for (const string& row : rows) {
        result.push_back(parseStringVector("[" + row + "]"));
    }
    
    return result;
}

// Safe output functions
string vectorToString(const vector<int>& v) {
    if (v.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) result += ",";
        result += to_string(v[i]);
    }
    result += "]";
    return result;
}

// FIXED: Order-aware vector<string> formatter
string vectorStringToString(const vector<string>& v, bool sortOutput = false) {
    if (v.empty()) return "[]";
    
    vector<string> output = v;
    if (sortOutput) {
        sort(output.begin(), output.end());
    }
    
    string result = "[";
    for (size_t i = 0; i < output.size(); i++) {
        if (i > 0) result += ",";
        result += "\\"" + output[i] + "\\"";
    }
    result += "]";
    return result;
}

string vectorToString(const vector<string>& v) {
    return vectorStringToString(v, false);
}

string vectorVectorCharToString(const vector<vector<char>>& vv) {
    if (vv.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < vv.size(); i++) {
        if (i > 0) result += ",";
        result += "[";
        for (size_t j = 0; j < vv[i].size(); j++) {
            if (j > 0) result += ",";
            result += "\\"";
            result += vv[i][j];
            result += "\\"";
        }
        result += "]";
    }
    result += "]";
    return result;
}

string vectorVectorStringToString(const vector<vector<string>>& vv, bool sortOutput = false) {
    if (vv.empty()) return "[]";
    
    vector<vector<string>> sorted_vv = vv;
    if (sortOutput) {
        // Sort each inner vector
        for (auto& inner : sorted_vv) {
            sort(inner.begin(), inner.end());
        }
        // Sort the outer vector
        sort(sorted_vv.begin(), sorted_vv.end());
    }
    
    string result = "[";
    for (size_t i = 0; i < sorted_vv.size(); i++) {
        if (i > 0) result += ",";
        result += "[";
        for (size_t j = 0; j < sorted_vv[i].size(); j++) {
            if (j > 0) result += ",";
            result += "\\"" + sorted_vv[i][j] + "\\"";
        }
        result += "]";
    }
    result += "]";
    return result;
}

string vectorVectorIntToString(const vector<vector<int>>& vv) {
    if (vv.empty()) return "[]";
    string result = "[";
    for (size_t i = 0; i < vv.size(); i++) {
        if (i > 0) result += ",";
        result += vectorToString(vv[i]);
    }
    result += "]";
    return result;
}

// FIXED: Normalize expected output for vector<string>
string normalizeExpectedStringVector(const string& expected, bool sortOutput = false) {
    if (!sortOutput) return expected;
    
    try {
        vector<string> parsed = parseStringVector(expected);
        return vectorStringToString(parsed, true);
    } catch (...) {
        return expected; // Return as-is if parsing fails
    }
}

// Helper function to normalize expected output for comparison
string normalizeExpectedOutput(const string& expected, bool sortOutput = false) {
    if (!sortOutput) return expected;
    
    try {
        // Parse expected as vector<vector<string>>
        vector<vector<string>> parsed = parseVectorVectorString(expected);
        return vectorVectorStringToString(parsed, true);
    } catch (...) {
        return expected; // Return as-is if parsing fails
    }
}

${finalUserCode}

int main() {
    try {
        Solution solution;
        bool orderMatters = ${orderMatters ? 'true' : 'false'};
`;

    testCases.forEach((tc, idx) => {
      let argDecls = '';
      let callArgs = [];
      let inputVals = this.parseTestInput(tc.input);

      parameters.forEach((param, i) => {
        let argName = `arg${idx}_${i}`;
        let val = inputVals[i] !== undefined ? inputVals[i] : '';
        
        // Convert value to string for C++ parsing
        let valStr = typeof val === 'string' ? val : JSON.stringify(val);
        
        // Better type detection for vector<vector<int>>
        if (param.type.includes('vector<vector<int>>')) {
          argDecls += `        vector<vector<int>> ${argName} = parseVectorVectorInt("${escapeCppString(valStr)}");\n`;
        } else if (param.type.includes('vector<vector<char>>')) {
          argDecls += `        vector<vector<char>> ${argName} = parseVectorVectorChar("${escapeCppString(valStr)}");\n`;
        } else if (param.type.includes('vector<vector<string>>')) {
          argDecls += `        vector<vector<string>> ${argName} = parseVectorVectorString("${escapeCppString(valStr)}");\n`;
        } else if (param.type.includes('vector<int>')) {
          argDecls += `        vector<int> ${argName} = parseIntVector("${escapeCppString(valStr)}");\n`;
        } else if (param.type.includes('vector<string>')) {
          argDecls += `        vector<string> ${argName} = parseStringVector("${escapeCppString(valStr)}");\n`;
        } else if (param.type.includes('int')) {
          argDecls += `        int ${argName} = ${val};\n`;
        } else if (param.type.includes('string')) {
          argDecls += `        string ${argName} = "${escapeCppString(val)}";\n`;
        } else if (param.type.includes('bool')) {
          argDecls += `        bool ${argName} = ${val ? 'true' : 'false'};\n`;
        } else if (param.type.includes('double') || param.type.includes('float')) {
          argDecls += `        ${param.type} ${argName} = ${val};\n`;
        } else {
          argDecls += `        auto ${argName} = ${valStr}; // ${param.type}\n`;
        }
        callArgs.push(argName);
      });

      let callExpr, outputExpr;
      const isVoidFunction = returnType === 'void';
      const isMutatingFunction = functionSignature.includes('&') && isVoidFunction;
      
      // Create expected output string properly escaped
      const expectedOutput = typeof tc.output === 'string' ? tc.output : JSON.stringify(tc.output);
      const escapedExpected = escapeCppString(expectedOutput);
      
      if (isMutatingFunction) {
        // For void functions that mutate arguments (like solveSudoku)
        callExpr = `        solution.${functionName}(${callArgs.join(', ')});\n`;
        
        // Determine which argument to output based on function name
        if (functionSignature.includes('solveSudoku') || functionSignature.includes('board')) {
          outputExpr = `        cout << "Test ${idx + 1} - Output: " << vectorVectorCharToString(${callArgs[0]}) << ", Expected: " << "${escapedExpected}" << endl;\n`;
        } else {
          outputExpr = `        cout << "Test ${idx + 1} - Output: Modified argument, Expected: " << "${escapedExpected}" << endl;\n`;
        }
      } else {
        let resultVar = `result${idx}`;
        callExpr = `        auto ${resultVar} = solution.${functionName}(${callArgs.join(', ')});\n`;
        
        // FIXED: Handle vector<string> return type with proper order handling
        if (returnType.includes('vector<string>') && !returnType.includes('vector<vector<string>>')) {
          outputExpr = `        string actualOutput${idx} = vectorStringToString(${resultVar}, !orderMatters);\n`;
          outputExpr += `        string expectedOutput${idx} = normalizeExpectedStringVector("${escapedExpected}", !orderMatters);\n`;
          outputExpr += `        cout << "Test ${idx + 1} - Output: " << actualOutput${idx} << ", Expected: " << expectedOutput${idx} << endl;\n`;
        } else if (returnType.includes('vector<vector<string>>')) {
          outputExpr = `        string actualOutput${idx} = vectorVectorStringToString(${resultVar}, !orderMatters);\n`;
          outputExpr += `        string expectedOutput${idx} = normalizeExpectedOutput("${escapedExpected}", !orderMatters);\n`;
          outputExpr += `        cout << "Test ${idx + 1} - Output: " << actualOutput${idx} << ", Expected: " << expectedOutput${idx} << endl;\n`;
        } else if (returnType.includes('vector<vector<int>>')) {
          outputExpr = `        cout << "Test ${idx + 1} - Output: " << vectorVectorIntToString(${resultVar}) << ", Expected: " << "${escapedExpected}" << endl;\n`;
        } else if (returnType.includes('vector<vector<char>>')) {
          outputExpr = `        cout << "Test ${idx + 1} - Output: " << vectorVectorCharToString(${resultVar}) << ", Expected: " << "${escapedExpected}" << endl;\n`;
        } else if (returnType.includes('vector<int>')) {
          outputExpr = `        cout << "Test ${idx + 1} - Output: " << vectorToString(${resultVar}) << ", Expected: " << "${escapedExpected}" << endl;\n`;
        } else {
          outputExpr = `        cout << "Test ${idx + 1} - Output: " << ${resultVar} << ", Expected: " << "${escapedExpected}" << endl;\n`;
        }
      }

      driverCode += `\n${argDecls}${callExpr}${outputExpr}`;
    });

    driverCode += `
    } catch (const exception& e) {
        cerr << "Error during execution: " << e.what() << endl;
        return 1;
    }
    return 0;
}
`;

    return driverCode;
  } catch (error) {
    throw new Error(`Error generating C++ driver: ${error.message}`);
  }
}

  // Python driver: robust for all LeetCode types
  generatePythonDriver(functionSignature, testCases, userCode, orderMatters = true) {
    try {
      const { functionName, parameters } = this.parseFunctionSignature(functionSignature, 'python');
      const hasClass = /class\s+\w+:/.test(userCode);
      const hasFunction = new RegExp(`def\\s+${functionName}\\s*\\(`).test(userCode);

      let finalUserCode;
      if (hasClass) {
        finalUserCode = userCode;
      } else if (hasFunction) {
        finalUserCode = `class Solution:\n${userCode.split('\n').map(l => '    ' + l).join('\n')}`;
      } else {
        finalUserCode = `class Solution:\n    def ${functionName}(${parameters.map(p => p.name).join(', ')}):\n${userCode.split('\n').map(l => '        ' + l).join('\n')}`;
      }

      // Driver code
      let driverCode = `import json
import sys
from typing import List, Optional, Any
import copy

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def parse_input(val):
    try:
        return json.loads(val)
    except:
        return val

def linked_list_to_list(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

def format_output(result):
    if isinstance(result, ListNode):
        return linked_list_to_list(result)
    elif isinstance(result, list):
        return result
    else:
        return result

def normalize_output(obj, sort_output=False):
    if not sort_output:
        return obj
    
    if isinstance(obj, list):
        if len(obj) > 0 and isinstance(obj[0], list):
            # 2D list - sort inner lists and then outer list
            normalized = [sorted(inner) if isinstance(inner, list) else inner for inner in obj]
            return sorted(normalized)
        else:
            # 1D list
            return sorted(obj)
    return obj

def pretty(obj):
    if isinstance(obj, list):
        return "[" + ",".join(pretty(x) for x in obj) + "]"
    if isinstance(obj, str):
        return '"' + obj + '"'
    return str(obj)

${finalUserCode}

def main():
    solution = Solution()
    order_matters = ${orderMatters ? 'True' : 'False'}
    try:
`;

      testCases.forEach((testCase, idx) => {
        const args = this.parseTestInput(testCase.input);
        let argAssigns = '';
        let callArgs = [];
        let mutatedArgName = null;

        // Remove 'self' from parameters for argument passing
        const userParams = parameters.filter(p => p.name !== 'self');

        userParams.forEach((param, i) => {
          let argName = `arg${idx}_${i}`;
          let val = args[i] !== undefined ? args[i] : '';
          if (/board/.test(param.name) && Array.isArray(val)) {
            argAssigns += `        ${argName} = copy.deepcopy(${JSON.stringify(val)})\n`;
            mutatedArgName = argName;
          } else {
            argAssigns += `        ${argName} = parse_input(${JSON.stringify(val)})\n`;
          }
          callArgs.push(argName);
        });

        let callExpr = `        result = solution.${functionName}(${callArgs.join(', ')})\n`;
        let outputExpr;
        if (mutatedArgName) {
          outputExpr = `        output = ${mutatedArgName}\n`;
        } else {
          outputExpr = `        output = format_output(result)\n`;
        }
        let expectedExpr = `        expected = parse_input(${JSON.stringify(testCase.output)})\n`;
        let printExpr = `        normalized_output = normalize_output(output, not order_matters)\n`;
        printExpr += `        normalized_expected = normalize_output(expected, not order_matters)\n`;
        printExpr += `        print(f"Test ${idx + 1} - Output: {pretty(normalized_output)}, Expected: {pretty(normalized_expected)}")\n`;

        driverCode += `${argAssigns}${callExpr}${outputExpr}${expectedExpr}${printExpr}\n`;
      });

      driverCode += `
    except Exception as e:
        print(f"Error during execution: {e}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    main()
`;

      return driverCode;
    } catch (error) {
      throw new Error(`Failed to generate Python driver code: ${error.message}`);
    }
  }

  // Java driver: robust for all LeetCode types
  generateJavaDriver(functionSignature, testCases, userCode, orderMatters = true) {
    try {
      // Parse function name and parameters from signature
      const fnMatch = functionSignature.match(/public\s+([^\s]+)\s+(\w+)\s*\(([^)]*)\)/);
      const returnType = fnMatch ? fnMatch[1] : '';
      const functionName = fnMatch ? fnMatch[2] : '';
      const paramsStr = fnMatch ? fnMatch[3] : '';
      const parameters = paramsStr
        ? paramsStr.split(',').map(p => {
            const parts = p.trim().split(/\s+/);
            return { 
              type: parts.slice(0, -1).join(' '), 
              name: parts[parts.length - 1] 
            };
          }).filter(p => p.name)
        : [];

      let fixedUserCode = userCode.trim();
      
      // Fix common issues in user code
      if (fixedUserCode.includes('for (int i = 0; i < n; i++)') && 
          fixedUserCode.includes('if (nQueens[i][col] == \'Q\')')) {
        fixedUserCode = fixedUserCode.replace(
          /for \(int i = 0; i < n; i\+\+\) \{\s*if \(nQueens\[i\]\[col\] == 'Q'\)/g,
          'for (int i = 0; i < row; i++) {\n            if (nQueens[i][col] == \'Q\')'
        );
      }

      let finalUserCode = fixedUserCode;
      if (!/class\s+Solution\b/.test(finalUserCode)) {
        const indentedUserCode = finalUserCode.split('\n').map(line => '    ' + line).join('\n');
        finalUserCode = `class Solution {\n${indentedUserCode}\n}`;
      } else {
        finalUserCode = finalUserCode.replace(/^public\s+class\s+Solution\b/, 'class Solution');
      }

      const escapeJavaString = (str) => {
        return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      };

      let mainClass = `
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

${finalUserCode}

public class Main {
    // Parse 2D integer array from string like "[[5,4],[6,4],[6,7],[2,3]]"
    public static int[][] parseIntMatrix(String s) {
        if (s == null || s.equals("[]") || s.equals("null")) return new int[0][0];
        
        // Remove outer brackets
        s = s.substring(1, s.length() - 1);
        
        // Use a more robust approach - find bracket pairs manually
        List<String> rows = new ArrayList<>();
        int start = 0;
        int bracketCount = 0;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '[') {
                if (bracketCount == 0) {
                    start = i + 1; // Start after the opening bracket
                }
                bracketCount++;
            } else if (c == ']') {
                bracketCount--;
                if (bracketCount == 0) {
                    // Found complete bracket pair
                    rows.add(s.substring(start, i));
                }
            }
        }
        
        int[][] result = new int[rows.size()][];
        
        for (int i = 0; i < rows.size(); i++) {
            String row = rows.get(i);
            
            if (row.trim().isEmpty()) {
                result[i] = new int[0];
                continue;
            }
            
            String[] nums = row.split(",");
            result[i] = new int[nums.length];
            
            for (int j = 0; j < nums.length; j++) {
                try {
                    result[i][j] = Integer.parseInt(nums[j].trim());
                } catch (NumberFormatException e) {
                    result[i][j] = 0; // Default value
                }
            }
        }
        
        return result;
    }
    
    public static List<List<String>> parseListListString(String s) {
        List<List<String>> result = new ArrayList<>();
        if (s == null || s.equals("[]") || s.equals("null")) return result;
        s = s.substring(1, s.length() - 1); // remove outer []
        String[] rows = s.split("],");
        for (String row : rows) {
            int start = row.indexOf('[');
            if (start != -1) {
                String inner = row.substring(start + 1).replace("]", "");
                List<String> innerList = new ArrayList<>();
                for (String val : inner.split(",")) {
                    val = val.replace("\\"", "").trim();
                    if (!val.isEmpty()) innerList.add(val);
                }
                result.add(innerList);
            }
        }
        return result;
    }
    
    // Parse 1D integer array from string like "[1,2,3,4]"
    public static int[] parseIntArray(String s) {
        if (s == null || s.equals("[]") || s.equals("null")) return new int[0];
        
        s = s.substring(1, s.length() - 1); // Remove brackets
        if (s.trim().isEmpty()) return new int[0];
        
        String[] parts = s.split(",");
        int[] result = new int[parts.length];
        
        for (int i = 0; i < parts.length; i++) {
            try {
                result[i] = Integer.parseInt(parts[i].trim());
            } catch (NumberFormatException e) {
                result[i] = 0;
            }
        }
        
        return result;
    }
    
    public static char[][] parseCharMatrix(String s) {
        if (s == null || s.equals("[]") || s.equals("null")) return new char[0][0];
        
        // Remove outer brackets and split by rows
        s = s.substring(1, s.length() - 1);
        String[] rows = s.split("],");
        
        char[][] result = new char[rows.length][];
        for (int i = 0; i < rows.length; i++) {
            String row = rows[i];
            int start = row.indexOf('[');
            if (start != -1) {
                String inner = row.substring(start + 1).replace("]", "");
                String[] chars = inner.split(",");
                result[i] = new char[chars.length];
                for (int j = 0; j < chars.length; j++) {
                    String charStr = chars[j].replace("\\"", "").trim();
                    result[i][j] = charStr.isEmpty() ? '.' : charStr.charAt(0);
                }
            }
        }
        return result;
    }
    
    public static String charMatrixToString(char[][] matrix) {
        if (matrix == null || matrix.length == 0) return "[]";
        
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < matrix.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("[");
            for (int j = 0; j < matrix[i].length; j++) {
                if (j > 0) sb.append(",");
                sb.append("\\"").append(matrix[i][j]).append("\\"");
            }
            sb.append("]");
        }
        sb.append("]");
        return sb.toString();
    }
    
    // Helper methods for order-agnostic comparison
    public static String normalizeListListString(List<List<String>> list, boolean sortOutput) {
        if (!sortOutput) {
            return list.toString();
        }
        
        // Create a copy and sort
        List<List<String>> normalized = new ArrayList<>();
        for (List<String> inner : list) {
            List<String> sortedInner = new ArrayList<>(inner);
            Collections.sort(sortedInner);
            normalized.add(sortedInner);
        }
        Collections.sort(normalized, (a, b) -> a.toString().compareTo(b.toString()));
        
        return normalized.toString();
    }
    
    public static String normalizeExpectedString(String expected, boolean sortOutput) {
        if (!sortOutput) return expected;
        
        try {
            List<List<String>> parsed = parseListListString(expected);
            return normalizeListListString(parsed, true);
        } catch (Exception e) {
            return expected;
        }
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        boolean orderMatters = ${orderMatters ? 'true' : 'false'};
        try {
`;

      testCases.forEach((tc, idx) => {
        let argDecls = '';
        let callArgs = [];
        let inputVals = this.parseTestInput(tc.input);

        parameters.forEach((param, i) => {
          let argName = `arg${idx}_${i}`;
          let val = inputVals[i] !== undefined ? inputVals[i] : '';
          
          // Convert value to string representation
          let valStr = typeof val === 'string' ? val : JSON.stringify(val);
          
          // Better type detection for Java 2D arrays
          if (/int\[\]\[\]/.test(param.type)) {
            argDecls += `            int[][] ${argName} = parseIntMatrix("${escapeJavaString(valStr)}");\n`;
          } else if (/char\[\]\[\]/.test(param.type)) {
            argDecls += `            char[][] ${argName} = parseCharMatrix("${escapeJavaString(valStr)}");\n`;
          } else if (/int\[\]/.test(param.type)) {
            argDecls += `            int[] ${argName} = parseIntArray("${escapeJavaString(valStr)}");\n`;
          } else if (/List<List<String>>/.test(param.type)) {
            argDecls += `            List<List<String>> ${argName} = parseListListString("${escapeJavaString(valStr)}");\n`;
          } else if (/List<Integer>/.test(param.type)) {
            const arrayStr = Array.isArray(val) ? val.join(',') : '';
            argDecls += `            List<Integer> ${argName} = Arrays.asList(${arrayStr});\n`;
          } else if (/List<String>/.test(param.type)) {
            const arrayItems = Array.isArray(val) ? val.map(v => `"${escapeJavaString(v)}"`).join(',') : '';
            argDecls += `            List<String> ${argName} = Arrays.asList(${arrayItems});\n`;
          } else if (/int/.test(param.type)) {
            argDecls += `            int ${argName} = ${val};\n`;
          } else if (/String/.test(param.type)) {
            argDecls += `            String ${argName} = "${escapeJavaString(val)}";\n`;
          } else if (/boolean/.test(param.type)) {
            argDecls += `            boolean ${argName} = ${val};\n`;
          } else if (/double/.test(param.type)) {
            argDecls += `            double ${argName} = ${val};\n`;
          } else {
            argDecls += `            // TODO: Add parsing for ${param.type}\n`;
            argDecls += `            Object ${argName} = "${escapeJavaString(valStr)}";\n`;
          }
          callArgs.push(argName);
        });

        let callExpr, outputExpr;
        const isVoidFunction = returnType === 'void';
        const isMutatingFunction = /\[\]\[\]/.test(functionSignature) && isVoidFunction;
        
        if (isMutatingFunction) {
          // For void functions that mutate arguments (like solveSudoku)
          callExpr = `            solution.${functionName}(${callArgs.join(', ')});\n`;
          
          // Output the mutated argument
          if (functionSignature.includes('solveSudoku') || functionSignature.includes('board')) {
            outputExpr = `            System.out.println("Test ${idx + 1} - Output: " + charMatrixToString(${callArgs[0]}) + ", Expected: " + "${escapeJavaString(tc.output)}");\n`;
          } else {
            outputExpr = `            System.out.println("Test ${idx + 1} - Output: Modified argument, Expected: " + "${escapeJavaString(tc.output)}");\n`;
          }
        } else {
          let resultVar = `result${idx}`;
          callExpr = `            Object ${resultVar} = solution.${functionName}(${callArgs.join(', ')});\n`;
          
          if (returnType.includes('List<List<String>>')) {
            outputExpr = `            String actualOutput = normalizeListListString((List<List<String>>)${resultVar}, !orderMatters);\n`;
            outputExpr += `            String expectedOutput = normalizeExpectedString("${escapeJavaString(tc.output)}", !orderMatters);\n`;
            outputExpr += `            System.out.println("Test ${idx + 1} - Output: " + actualOutput + ", Expected: " + expectedOutput);\n`;
          } else {
            outputExpr = `            System.out.println("Test ${idx + 1} - Output: " + ${resultVar} + ", Expected: " + "${escapeJavaString(tc.output)}");\n`;
          }
        }

        mainClass += `
${argDecls}${callExpr}${outputExpr}
`;
      });

      mainClass += `
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;

      return mainClass;
    } catch (error) {
      throw new Error('Error generating Java driver: ' + error.message);
    }
  }

  generateJavaScriptDriver(functionSignature, testCases, userCode, orderMatters = true) {
    try {
      // Parse function name and parameters from signature
      const match = functionSignature.match(/function\s+(\w+)\s*\(([^)]*)\)/) ||
                    functionSignature.match(/(\w+)\s*\(([^)]*)\)/) ||
                    functionSignature.match(/var\s+(\w+)\s*=\s*function\s*\(([^)]*)\)/) ||
                    functionSignature.match(/const\s+(\w+)\s*=\s*\(([^)]*)\)/) ||
                    functionSignature.match(/let\s+(\w+)\s*=\s*\(([^)]*)\)/);
                    
      const functionName = match ? match[1] : 'solution';
      const paramString = match ? match[2] : '';
      const parameters = paramString ? paramString.split(',').map(p => p.trim()).filter(Boolean) : [];

      let driverCode = `
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Enhanced parsing functions for all LeetCode data types
function parseInput(input) {
    if (typeof input === 'string') {
        try {
            return JSON.parse(input);
        } catch (e) {
            // Handle edge cases for malformed JSON-like strings
            if (input.startsWith('[') && input.endsWith(']')) {
                return parseArrayFromString(input);
            }
            return input;
        }
    }
    return input;
}

function parseArrayFromString(s) {
    if (!s || s === "[]" || s === "null") return [];
    
    // Handle 2D arrays like "[[5,4],[6,4],[6,7],[2,3]]"
    if (s.includes('],[')) {
        return parse2DArray(s);
    }
    
    // Handle 1D arrays like "[1,2,3,4]"
    try {
        return JSON.parse(s);
    } catch (e) {
        // Fallback parsing
        const cleaned = s.replace(/[\\[\\]]/g, '');
        if (!cleaned) return [];
        return cleaned.split(',').map(x => {
            const trimmed = x.trim();
            if (trimmed === '') return null;
            if (!isNaN(trimmed)) return Number(trimmed);
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                return trimmed.slice(1, -1);
            }
            return trimmed;
        }).filter(x => x !== null);
    }
}

function parse2DArray(s) {
    if (!s || s === "[]" || s === "null") return [];
    
    // Remove outer brackets
    const content = s.substring(1, s.length - 1);
    
    // Find individual arrays
    const arrays = [];
    let current = '';
    let bracketCount = 0;
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === '[') {
            bracketCount++;
            if (bracketCount === 1) {
                current = '';
                continue;
            }
        } else if (char === ']') {
            bracketCount--;
            if (bracketCount === 0) {
                // Parse the current array content
                if (current.trim()) {
                    const nums = current.split(',').map(x => {
                        const trimmed = x.trim();
                        return isNaN(trimmed) ? trimmed : Number(trimmed);
                    });
                    arrays.push(nums);
                }
                continue;
            }
        } else if (char === ',' && bracketCount === 0) {
            continue; // Skip commas between arrays
        }
        
        if (bracketCount > 0) {
            current += char;
        }
    }
    
    return arrays;
}

function createLinkedList(vals) {
    if (!vals || vals.length === 0) return null;
    const head = new ListNode(vals[0]);
    let current = head;
    for (let i = 1; i < vals.length; i++) {
        current.next = new ListNode(vals[i]);
        current = current.next;
    }
    return head;
}

function linkedListToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

function formatOutput(result) {
    if (result === null || result === undefined) return 'null';
    if (typeof result === 'object' && result.constructor === ListNode) {
        return JSON.stringify(linkedListToArray(result));
    }
    if (Array.isArray(result)) {
        return JSON.stringify(result);
    }
    return String(result);
}

function normalizeOutput(obj, sortOutput = false) {
    if (!sortOutput) return obj;
    
    if (Array.isArray(obj)) {
        if (obj.length > 0 && Array.isArray(obj[0])) {
            // 2D array - sort inner arrays and then outer array
            const normalized = obj.map(inner => 
                Array.isArray(inner) ? [...inner].sort() : inner
            );
            return normalized.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        } else {
            // 1D array
            return [...obj].sort();
        }
    }
    return obj;
}

${userCode}

function runTests() {
    const orderMatters = ${orderMatters ? 'true' : 'false'};
    try {
`;

      testCases.forEach((testCase, index) => {
        const inputVals = this.parseTestInput(testCase.input);
        let args = [];
        
        // Handle different parameter counts
        if (parameters.length === 0) {
          // No parameters
          args = [];
        } else if (parameters.length === 1) {
          // Single parameter
          const val = inputVals[0] !== undefined ? inputVals[0] : '';
          args = [`parseInput(${JSON.stringify(val)})`];
        } else {
          // Multiple parameters
          args = parameters.map((param, i) => {
            const val = inputVals[i] !== undefined ? inputVals[i] : '';
            return `parseInput(${JSON.stringify(val)})`;
          });
        }

        driverCode += `
        // Test ${index + 1}
        console.log('Running Test ${index + 1}...');
        try {
            let output = ${functionName}(${args.join(', ')});
            let expected = parseInput(${JSON.stringify(testCase.output)});
            
            // Normalize outputs if order doesn't matter
            let normalizedOutput = normalizeOutput(output, !orderMatters);
            let normalizedExpected = normalizeOutput(expected, !orderMatters);
            
            let formattedOutput = formatOutput(normalizedOutput);
            let formattedExpected = formatOutput(normalizedExpected);
            
            console.log(\`Test ${index + 1} - Output: \${formattedOutput}, Expected: \${formattedExpected}\`);
        } catch (error) {
            console.error(\`Test ${index + 1} failed with error: \${error.message}\`);
        }
`;
      });

      driverCode += `
    } catch (error) {
        console.error('Error during test execution:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run all tests
runTests();
`;

      return driverCode;
    } catch (error) {
      throw new Error('Error generating JavaScript driver: ' + error.message);
    }
  }
}

module.exports = new DriverCodeGenerator();