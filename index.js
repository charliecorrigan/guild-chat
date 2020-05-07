const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const app = express()
const PostgresClient = require('./postgresClient');
const MessageProvider = require('./messageProvider');

const http = require('http').Server(app);
const io = require('socket.io')(http);

const pgClient = new PostgresClient(pool);
const messageProvider = new MessageProvider(pgClient, io);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const login = async (request, response, next) => {
  const user = messageProvider.connect(request.body)
  request.data = user;
  next()
}

// const logoff = async (request, response, next) => {
//   // delete Socket id from user record
//   messageProvider.disconnect(request.body)
//   next()
// }

const getMessages = async (request, response, next) => {
  const messages = await messageProvider.getMessages(request.query)
  request.data = messages;
  next()
}

const postMessage = async (request, response, next) => {
  const message = await messageProvider.postMessage(request.body)
  request.data = message;
  next()
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', login, (req, res) => {
  res.status(200).json(req.data)
});

// TO DO
// app.post('/logoff', login, (req, res) => {
//   res.status(204);
// });

app.post('/messages', postMessage, (req, res) => {
  res.status(200);
});

app.get('/messages', getMessages, (req, res) => {
  res.status(200).json(req.data)
});

http.listen(process.env.PORT || 3000, function() {
  console.log(`listening on ${process.env.PORT || 3000}`);
});