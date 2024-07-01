const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { SESSION_SECRET } = require('../config');

module.exports = (app) => {

  // Enable Cross Origin Resource Sharing with specific options
  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  };

  // Use CORS with the options setted before
  app.use(cors(corsOptions));

  // Transforms raw string of req.body into JSON
  app.use(bodyParser.json());

  // Parses urlencoded bodies
  app.use(bodyParser.urlencoded({ extended: true }));

  // Trust first proxy if you are behind a proxy (e.g., Heroku)
  app.set('trust proxy', 1);

  // Creates a session
  app.use(
    session({  
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );

  return app;
}