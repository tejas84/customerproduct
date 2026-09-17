require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

start();
