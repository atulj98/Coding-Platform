const driverCodeGenerator = require('../services/driverCodeGenerator');
const Problem = require('../models/Problem');
const codeExecutionService = require('../services/codeExecutionService');
const { saveSubmission } = require('../services/submissionService');

exports.executeCode = async (req, res) => {
  try {
    const { code, language, problemId, input } = req.body;

    // Get problem details if problemId is provided
    let problem = null;
    let finalCode = code;
    
    if (problemId) {
      problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      // Generate driver code automatically
      const functionSignature = problem.functionSignatures.get(language.toLowerCase());
      if (functionSignature && problem.testCases && problem.testCases.length > 0) {
        try {
          finalCode = driverCodeGenerator.generate(
            language,
            functionSignature,
            problem.testCases,
            code,
            problem.description || ''
          );
        } catch (driverError) {
          console.warn('Driver code generation failed:', driverError.message);
          // Fall back to original code if driver generation fails
          finalCode = code;
        }
      }
    }

    // Execute the code
    const result = await codeExecutionService.executeCode(finalCode, language, input);

    // If this was a problem execution, save the submission
    if (problemId) {
      await saveSubmission(req.user.id, problemId, code, language, result);
    }

    res.json(result);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ message: 'Code execution failed', error: error.message });
  }
};