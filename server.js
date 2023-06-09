var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
var port = process.env.PORT || 3000
var Users = require('./routes/Users')
var Events = require('./routes/Events')
var app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

var Server = require('socket.io')
var http = require('http').createServer(app)

const io = Server(http);
app.use((req, res, next) => {
	req.io = io;
	next();
});

io.on("connect", (socket) => {
	console.log("Client connected");
	// socket.on("disconnect", () => console.log("Client disconnected"));
});

const mongoURL = 'mongodb://localhost:27017/sbs'

mongoose.connect( mongoURL, { 
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => 
    console.log('MongoDB Connected')
).catch(err => 
    console.log(err)
)
 
app.use('/users', Users)
app.use('/api', Events)

http.listen(port, function() {
  console.log('Server is running on port: ' + port)
})

