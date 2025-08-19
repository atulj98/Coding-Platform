#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    void backtrack(int n, int row, 
                   vector<bool>& columns, vector<bool>& diag1, vector<bool>& diag2,
                   vector<string>& board,
                   vector<vector<string>>& result) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (columns[col] || diag1[row - col + n - 1] || diag2[row + col]) continue;
            
            board[row][col] = 'Q';
            columns[col] = diag1[row - col + n - 1] = diag2[row + col] = true;
            
            backtrack(n, row + 1, columns, diag1, diag2, board, result);
            
            board[row][col] = '.';
            columns[col] = diag1[row - col + n - 1] = diag2[row + col] = false;
        }
    }

    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<string> board(n, string(n, '.'));
        vector<bool> columns(n, false);
        vector<bool> diag1(2*n-1, false);
        vector<bool> diag2(2*n-1, false);
        backtrack(n, 0, columns, diag1, diag2, board, result);
        return result;
    }
};

// Helper functions for parsing
vector<int> parseIntVector(string s) {
    vector<int> result;
    if (s == "[]") return result;
    
    s = s.substr(1, s.length() - 2); // Remove brackets
    if (s.empty()) return result;
    
    size_t pos = 0;
    while (pos < s.length()) {
        size_t comma = s.find(',', pos);
        if (comma == string::npos) comma = s.length();
        
        string num = s.substr(pos, comma - pos);
        // Remove whitespace
        size_t start = num.find_first_not_of(" \t");
        size_t end = num.find_last_not_of(" \t");
        if (start != string::npos) {
            num = num.substr(start, end - start + 1);
            result.push_back(stoi(num));
        }
        
        pos = comma + 1;
    }
    return result;
}

vector<string> parseStringVector(string s) {
    vector<string> result;
    if (s == "[]") return result;
    
    s = s.substr(1, s.length() - 2); // Remove brackets
    if (s.empty()) return result;
    
    size_t pos = 0;
    while (pos < s.length()) {
        if (s[pos] == '"') {
            pos++; // Skip opening quote
            size_t end = s.find('"', pos);
            if (end != string::npos) {
                result.push_back(s.substr(pos, end - pos));
                pos = end + 1;
                // Skip comma and spaces
                while (pos < s.length() && (s[pos] == ',' || s[pos] == ' ')) pos++;
            } else {
                break;
            }
        } else {
            pos++;
        }
    }
    return result;
}

int main() {
    Solution solution;
    
    try {
        // Test case 1: n = 4
        {
            int arg0_0 = 4;
            auto result = solution.solveNQueens(arg0_0);
            cout << "Test 1 - Output: ";
            cout << "[";
            for (size_t i = 0; i < result.size(); i++) {
                if (i > 0) cout << ",";
                cout << "[\"" << result[i][0];
                for (size_t j = 1; j < result[i].size(); j++) {
                    cout << "\",\"" << result[i][j];
                }
                cout << "\"]";
            }
            cout << "], Expected: [[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"],[\"...Q\",\"..Q.\",\"Q...\",\".Q..\"]]" << endl;
        }
        
        // Test case 2: n = 1
        {
            int arg1_0 = 1;
            auto result = solution.solveNQueens(arg1_0);
            cout << "Test 2 - Output: ";
            cout << "[";
            for (size_t i = 0; i < result.size(); i++) {
                if (i > 0) cout << ",";
                cout << "[\"" << result[i][0];
                for (size_t j = 1; j < result[i].size(); j++) {
                    cout << "\",\"" << result[i][j];
                }
                cout << "\"]";
            }
            cout << "], Expected: [[\"Q\"]]" << endl;
        }
        
        // Test case 3: n = 8 (just count)
        {
            int arg2_0 = 8;
            auto result = solution.solveNQueens(arg2_0);
            cout << "Test 3 - Output: " << result.size() << ", Expected: 92" << endl;
        }
        
    } catch (exception& e) {
        cerr << "Error during execution: " << e.what() << endl;
    }
    
    return 0;
}
