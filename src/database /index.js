import cls from 'cls-hooked';
import { Sequelize } from 'sequelize';
import { registerModels } from '../models';



export default class Database {
  constructor(environment, dbConfig) {
    this.environment = environment;
    this.dbConfig = dbConfig;
    this.isTestEnvironment = this.environment === 'test';
  }

  async connect() {
    // set up the namespace for transactions
    const namespace = cls.createNamespace('transactions-namespace');
    Sequelize.useCLS(namespace);

    //create the connection
    const { username, password, host, port, database, dialect } = this.dbConfig[this.environment];
    this.connection = new Sequelize({
      username,
      password,
      host,
      port,
      database,
      dialect,
      logging: this.isTestEnvironment ? false : console.log,
    });
    //Check if we connected successfully
    await this.connection.authenticate({ logging: false });
    if (!this.isTestEnvironment) {
      console.log('connection to the database has been established successfully');
    }
    // register the models
    registerModels(this.connection);

    //synch models
    await this.sync();
  }

  async disconnect() {
    this.connection.close();
  }
  async sync() {
    await this.connection.sync({
      logging: false,
      force: this.isTestEnvironment,
    });
    if (!this.isTestEnvironment) {
      console.log('connections synched sucessfully');
    }
  }
}
