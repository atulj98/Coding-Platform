const Redis = require('redis');
const logger = require('../utils/logger');

class QueueManager {
  constructor() {
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redis.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    this.redis.on('connect', () => {
      logger.info('Connected to Redis');
    });

    this.queues = {
      execution: 'execution_queue',
      results: 'results_queue',
      priority: 'priority_queue'
    };

    this.maxQueueSize = 1000;
    this.maxRetries = 3;
  }

  async connect() {
    await this.redis.connect();
  }

  async addToQueue(queueName, data, priority = 0) {
    try {
      const queueKey = this.queues[queueName];
      if (!queueKey) {
        throw new Error(`Invalid queue name: ${queueName}`);
      }

      // Check queue size
      const queueSize = await this.redis.lLen(queueKey);
      if (queueSize >= this.maxQueueSize) {
        throw new Error(`Queue ${queueName} is full`);
      }

      const item = {
        id: data.id || Date.now().toString(),
        data,
        priority,
        retries: 0,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      if (priority > 0) {
        // High priority items go to the front
        await this.redis.lPush(queueKey, JSON.stringify(item));
      } else {
        // Normal priority items go to the back
        await this.redis.rPush(queueKey, JSON.stringify(item));
      }

      // Set expiration for the item
      await this.redis.expire(queueKey, 3600); // 1 hour

      logger.info(`Added item to queue ${queueName}: ${item.id}`);
      return item.id;
    } catch (error) {
      logger.error('Error adding to queue:', error);
      throw error;
    }
  }

  async getFromQueue(queueName, timeout = 10) {
    try {
      const queueKey = this.queues[queueName];
      if (!queueKey) {
        throw new Error(`Invalid queue name: ${queueName}`);
      }

      // Blocking pop with timeout
      const result = await this.redis.blPop(queueKey, timeout);
      if (!result) {
        return null;
      }

      const item = JSON.parse(result.element);
      logger.info(`Retrieved item from queue ${queueName}: ${item.id}`);
      return item;
    } catch (error) {
      logger.error('Error getting from queue:', error);
      throw error;
    }
  }

  async requeueItem(queueName, item, delay = 0) {
    try {
      item.retries = (item.retries || 0) + 1;
      item.status = 'retrying';

      if (item.retries > this.maxRetries) {
        // Move to dead letter queue
        await this.addToDeadLetterQueue(queueName, item);
        return false;
      }

      if (delay > 0) {
        // Use delayed queue
        setTimeout(async () => {
          await this.addToQueue(queueName, item.data, item.priority);
        }, delay);
      } else {
        await this.addToQueue(queueName, item.data, item.priority);
      }

      return true;
    } catch (error) {
      logger.error('Error requeuing item:', error);
      return false;
    }
  }

  async addToDeadLetterQueue(queueName, item) {
    const deadLetterKey = `${this.queues[queueName]}_dead`;
    item.status = 'failed';
    item.failedAt = new Date().toISOString();
    
    await this.redis.rPush(deadLetterKey, JSON.stringify(item));
    logger.warn(`Item moved to dead letter queue: ${item.id}`);
  }

  async getQueueStats(queueName) {
    try {
      const queueKey = this.queues[queueName];
      const deadLetterKey = `${queueKey}_dead`;
      
      const [queueSize, deadLetterSize] = await Promise.all([
        this.redis.lLen(queueKey),
        this.redis.lLen(deadLetterKey)
      ]);

      return {
        queueName,
        size: queueSize,
        deadLetterSize,
        maxSize: this.maxQueueSize,
        utilization: (queueSize / this.maxQueueSize) * 100
      };
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      return { queueName, size: 0, deadLetterSize: 0, maxSize: this.maxQueueSize, utilization: 0 };
    }
  }

  async clearQueue(queueName) {
    try {
      const queueKey = this.queues[queueName];
      await this.redis.del(queueKey);
      logger.info(`Cleared queue: ${queueName}`);
    } catch (error) {
      logger.error('Error clearing queue:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.redis.disconnect();
  }
}

module.exports = new QueueManager();
