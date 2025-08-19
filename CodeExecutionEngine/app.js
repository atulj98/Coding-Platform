const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const codeExecutionRoutes = require('./routes/codeExecution');
const authRoutes = require('./routes/auth');
const problemsRoutes = require('./routes/problems');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const { register } = require('./monitoring/metrics');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
app.use(rateLimiter.general);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        service: 'code-execution-engine',
        timestamp: new Date().toISOString()
    });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/problems', problemsRoutes);


// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close().then(() => {
          logger.info('Process terminated');
          process.exit(0);
        }).catch((err) => {
          logger.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        mongoose.connection.close().then(() => {
          logger.info('Process terminated');
          process.exit(0);
        }).catch((err) => {
          logger.error('Error closing MongoDB connection:', err);
          process.exit(1);
        });
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports = app;
