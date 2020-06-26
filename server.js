var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
var port = process.env.PORT || 3000
var Users = require('./routes/Users')
var Events = require('./routes/Events')
var app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

const mongoURL = 'mongodb://localhost:27017/sbs'

mongoose.connect( mongoURL, { 
    useNewUrlParser: true, useUnifiedTopology: true 
}).then(() => 
    console.log('MongoDB Connected')
).catch(err => 
    console.log(err)
)
 
app.use('/users', Users)
app.use('/api', Events)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})
