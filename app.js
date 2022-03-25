//environment variables
require('dotenv').config()

// Common modules
const path = require('path')

// MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Initializing Express
const express = require('express'),
      app = express(),
      port = process.env.PORT;

// Middlewares
const compression = require('compression');
app.use(compression());

const helmet = require('helmet');
const trusted = [
  "'self'","'unsafe-eval'","'unsafe-inline'",
];
app.use(helmet({ contentSecurityPolicy: {
  directives: {
      scriptSrc: ['code.jquery.com',,].concat(trusted),
  }},
  crossOriginEmbedderPolicy: false,
}));

const session = require('express-session'),
      MongoStore = require('connect-mongo');
      bodyParser = require('body-parser');
      passport = require('passport');
      initializePassport = require('./utilities/passport-util');
const seconds = 10 //15 minutes = 15*60
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:  process.env.MONGO_URI,
  //mongooseConnection: db,
    collection: 'sessions',
    ttl: seconds // save session
  }),
  /*cookies */
  cookie: {
    secure: false,
    maxAge:  seconds*1000
  },
 name: "id"
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//permission to serve static files
app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'public')))
initializePassport(app, passport);

// View engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Routers
app.use('/', require('./routes/index'))


// Run server
app.listen(port, () => console.log(`listening on port ${port}!`))


// when owner is authenticated
  // generate random_string, k_owner, pk_owner, k_device, pk_device and ss by clicking button 'register new device'
  // hash everything to server
  // display /random_string#ss via qr code on /random_string
  // if device scans /random_string#ss, check hash.
  // if valid, authenticate device
