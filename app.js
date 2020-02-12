/** @format */

console.log('MODE:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') require('dotenv').config();

require('./mongooseClient');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

// ROUTES:
const userRoutes = require('./routes/users');
const lorelineRoutes = require('./routes/lorelines');

var app = express();

// MIDDLEWARE:
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api/users', userRoutes);
app.use('/api/lorelines', lorelineRoutes);

// ERROR:
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    var valErrors = [];
    Object.keys(err.errors).forEach(key =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).send(valErrors);
  }
});

// DEV PORT ((DO NOT MODIFY)):
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
