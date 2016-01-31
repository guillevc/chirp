'use strict';

require('dotenv').load({ path: '.env' });
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
//const debug
//const validator = require('express-validator');
//const errorHandler = require('errorhandler');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo/es5')(session);
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
app.use(morgan('dev'));
//if (config.env === 'development') app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
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
   if (req.user) {
     res.locals.user = req.user;
     res.locals.user.jsonString = JSON.stringify(req.user, null, 2);
   }
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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development'? err : {},
  });
});

/**
 * Start server
 */
app.listen(config.port, () =>
  console.log(`[${config.env}] Express server listening on port ${config.port}`)
);

module.exports = app;
