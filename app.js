'use strict';

// Load env vars from .env file
require('dotenv').load({ path: '.env' });

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo/es5')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const sass = require('node-sass-middleware');
const compression = require('compression');
//const validator = require('express-validator');
//const csrf = require('csurf');
const config = require('./config/vars');

/**
 * Passport configuration
 */
 require('./config/passport');

/**
 * Connect to MongoDB
 */
mongoose.connect(config.mongodb);
mongoose.connection.on('error', () => {
  console.log('MongoDB connection error');
  process.exit(1);
});

/**
 * Create Express app
 */
const app = express();

/**
 * Express configuration.
 */
if (config.env === 'development') app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true,
  debug: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.sessionSecret,
  store: new MongoStore({
    url: config.mongodb,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
//app.use(csrf());

/**
 * User data to req.locals and load routes
 */
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(require('./routes'));

/**
 * Error handling
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) { //jshint ignore:line
  if (err.name === 'ValidationError' && !err.status) {
    err.status = 400;
  }
  res.status(err.status || 500);
  res.render('error', {
    status: err.status,
    name: err.name,
    message: err.message,
    stack: app.get('env') === 'development'? err.stack : null,
  });
});

/**
 * Start server
 */
app.listen(config.port, () =>
  console.log(`[${config.env}] Express server listening on port ${config.port}`)
);

module.exports = app;
