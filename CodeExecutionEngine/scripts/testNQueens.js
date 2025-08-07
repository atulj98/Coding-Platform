const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

async function testNQueens() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform');
    
    // Find the N-Queens problem
    const problem = await Problem.findOne({ title: 'N-Queens' });
    if (!problem) {
      console.log('N-Queens problem not found. Creating it...');
      
      const nQueensProblem = new Problem({
        title: 'N-Queens',
        description: `The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle.`,
        difficulty: 'hard',
        tags: ['backtracking', 'recursion', 'array'],
        testCases: [
          { input: '4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', isHidden: false },
          { input: '1', output: '[["Q"]]', isHidden: false },
          { input: '2', output: '[]', isHidden: true },
          { input: '3', output: '[]', isHidden: true }
        ],
        functionSignatures: new Map([
          ['cpp', 'vector<vector<string>> solveNQueens(int n)'],
          ['python', 'def solveNQueens(self, n: int) -> List[List[str]]:'],
          ['java', 'public List<List<String>> solveNQueens(int n)']
        ]),
        timeLimit: 5000, // 5 seconds for N-Queens
        memoryLimit: 512,
        createdBy: new mongoose.Types.ObjectId()
      });
      
      await nQueensProblem.save();
      console.log('N-Queens problem created successfully:', nQueensProblem._id);
    }
    
    // Test the driver code generation
    const driverCodeGenerator = require('../src/services/driverCodeGenerator');
    
    const cppSolution = `void backtrack(int n, int row, 
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

    vector<vector<string>> result;
    vector<string> board(n, string(n, '.'));
    vector<bool> columns(n, false);
    vector<bool> diag1(2*n-1, false);
    vector<bool> diag2(2*n-1, false);
    backtrack(n, 0, columns, diag1, diag2, board, result);
    return result;`;
    
    console.log('\n=== TESTING N-QUEENS DRIVER CODE GENERATION ===');
    try {
      const testCases = [
        { input: '4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
        { input: '1', output: '[["Q"]]' }
      ];
      
      const driverCode = driverCodeGenerator.generate(
        'cpp',
        'vector<vector<string>> solveNQueens(int n)',
        testCases,
        cppSolution
      );
      
      console.log('✅ C++ driver code generated successfully!');
      
      // Write to file for testing
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(__dirname, '../generated_nqueens_test.cpp');
      fs.writeFileSync(outputPath, driverCode);
      console.log(`📁 Driver code written to: ${outputPath}`);
      
    } catch (error) {
      console.error('❌ Driver code generation failed:', error.message);
      console.error('Stack:', error.stack);
    }
    
    await mongoose.connection.close();
    console.log('✅ Test completed');
    process.exit(0);
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testNQueens();
