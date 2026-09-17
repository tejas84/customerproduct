require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Errno:", error.errno);
    console.error("SQL State:", error.sqlState);

    process.exit(1);
}
  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

start();
