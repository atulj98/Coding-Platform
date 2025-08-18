const mongoose = require('mongoose');

let connection;

module.exports = {
  async setup() {
    // Use in-memory database URI for testing
    const MONGODB_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/codeexec_test';
    
    try {
      connection = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Test database connected');
    } catch (error) {
      console.warn('Could not connect to MongoDB, using mock:', error.message);
      // If MongoDB is not available, mock the database operations
      this.mockDatabase();
    }
  },

  async teardown() {
    if (connection) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  },

  async clearDatabase() {
    if (mongoose.connection.readyState === 1) {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    }
  },

  mockDatabase() {
    // Mock mongoose models for testing when DB is not available
    jest.doMock('mongoose', () => ({
      connect: jest.fn().mockResolvedValue(true),
      connection: {
        close: jest.fn().mockResolvedValue(true),
        dropDatabase: jest.fn().mockResolvedValue(true),
        collections: {},
        readyState: 1
      },
      Schema: jest.fn(() => ({
        add: jest.fn(),
        index: jest.fn(),
        pre: jest.fn(),
        post: jest.fn()
      })),
      model: jest.fn(() => ({
        create: jest.fn().mockResolvedValue({}),
        find: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        }),
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({})
        }),
        deleteMany: jest.fn().mockResolvedValue({})
      })),
      Types: {
        ObjectId: jest.fn().mockImplementation(() => 'mockObjectId')
      }
    }));
  }
};
