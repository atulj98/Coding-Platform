const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

async function checkDatabase() {
  try {
    // Use the same connection string as your main app
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform';
    console.log('Connecting to:', mongoUri.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const dbName = mongoose.connection.db.databaseName;
    console.log('Connected to database:', dbName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Count problems
    const problemCount = await Problem.countDocuments({});
    console.log(`\nTotal problems in database: ${problemCount}`);
    
    // List all problems
    const problems = await Problem.find({}, 'title difficulty createdAt').lean();
    console.log('\nProblems found:');
    problems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} (${problem.difficulty}) - Created: ${problem.createdAt}`);
    });
    
    // Check if we can create a test problem
    console.log('\n=== Testing Problem Creation ===');
    const testProblem = new Problem({
      title: 'Test Problem - Delete Me',
      description: 'This is a test problem to verify database connection',
      difficulty: 'easy',
      tags: ['test'],
      testCases: [{ input: 'test', output: 'test', isHidden: false }],
      functionSignatures: new Map([['python', 'def test():']]),
      timeLimit: 1000,
      memoryLimit: 128,
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true
    });
    
    const savedTest = await testProblem.save();
    console.log('✅ Test problem created successfully:', savedTest._id);
    
    // Delete the test problem
    await Problem.findByIdAndDelete(savedTest._id);
    console.log('✅ Test problem deleted successfully');
    
    await mongoose.connection.close();
    console.log('\n✅ Database check completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing connection:', closeError);
    }
    process.exit(1);
  }
}

checkDatabase();
