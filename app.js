require('./config/config')
require('./models/db')
require('./config/passportConfig')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

const userRoutes = require('./routes/users')
var app = express()

//middleware
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize())
app.use('/api/users', userRoutes)

//error handeling
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    var valErrors = []
    Object.keys(err.errors).forEach(key =>
      valErrors.push(err.errors[key].message)
    )
    res.status(422).send(valErrors)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
