import './config';
import Database from './database';
import environment from './config/environments';
import dbConfig from './config/database';

// IIFE = immediately invoking function expression

(async () => {
  try {
    const db = new Database(environment.nodeEnv, dbConfig);
    await db.connect();
    const App = require('./app').default;
    const app = new App();
    app.listen();
  } catch (error) {
    console.error(
      'something went wrong while connecting to the server:\n',
      error.stack
    );
  }
})();
