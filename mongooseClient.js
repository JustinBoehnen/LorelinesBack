const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () =>
  console.log('MongoDB Database connected!')
)
mongoose.connection.on('error', err => console.log(err))
