const config = {

  /**
   * Enviroment variables
   */
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'sessionsecret123',
  mongodb: process.env.MONGODB ||
    process.env.MONGOLAB_URI || 'mongodb://localhost:27017/chirp-test',

};

module.exports = config;
