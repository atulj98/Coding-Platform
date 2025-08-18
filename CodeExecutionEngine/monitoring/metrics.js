const express = require('express');
const promClient = require('prom-client');

const register = new promClient.Registry();

// Custom metrics
const executionCounter = new promClient.Counter({
  name: 'code_executions_total',
  help: 'Total number of code executions',
  labelNames: ['language', 'status']
});

const executionDuration = new promClient.Histogram({
  name: 'code_execution_duration_seconds',
  help: 'Duration of code execution',
  labelNames: ['language']
});

const queueSize = new promClient.Gauge({
  name: 'execution_queue_size',
  help: 'Current size of execution queue'
});

register.registerMetric(executionCounter);
register.registerMetric(executionDuration);
register.registerMetric(queueSize);

// Default metrics
promClient.collectDefaultMetrics({ register });

module.exports = {
  register,
  executionCounter,
  executionDuration,
  queueSize
};
