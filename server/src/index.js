const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server, Socket } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: '*' } });

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.data.username = username;
//   next();
// });


dotenv.config();

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  io.emit('test123', 'hello')

  // const users = [];
  // for (const [id, connectedSocket] of io.of('/').sockets) {
  //   users.push({
  //     userID: id,
  //     username: connectedSocket.data.username,
  //   });
  // }
  // socket.emit('users', users);

  // socket.broadcast.emit('user connected', {
  //   userID: socket.id,
  //   username: socket.data.username,
  // });

  // socket.on('private message', ({ content, to }) => {
  //   socket.to(to).emit('private message', {
  //     content: content,
  //     from: socket.id,
  //   });
  // });

  // socket.on('disconnect', () => {
  //   socket.broadcast.emit('user disconnected', socket.id);
  // });
});

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger(':method :url :status - :response-time ms'));

app.get('/', (req, res) => {
  res.json('Welcome to Blue Ocean! 🤗');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Now running on http://localhost:${PORT}`));


module.exports = app;