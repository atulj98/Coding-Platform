const mongoose = require('mongoose');
require('dotenv').config();

const Problem = require('./models/Problem');

async function listProblems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform');
    console.log('🔗 Connected to MongoDB');

    const problems = await Problem.find({}, '_id title');
    
    console.log('\n📊 Available Problems in Database:');
    console.log('=================================');
    
    if (problems.length === 0) {
      console.log('❌ No problems found! Run setup-database.js first.');
    } else {
      problems.forEach((problem, index) => {
        console.log(`${index + 1}. ${problem.title}`);
        console.log(`   ID: ${problem._id}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listProblems();
