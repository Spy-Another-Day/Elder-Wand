const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server, Socket } = require("socket.io");
const usersRoutes = require("./database/controllers/users.js");
const wordsRoutes = require("./database/controllers/words.js");
const groupsRoutes = require("./database/controllers/groups.js");
const historyRoutes = require("./database/controllers/history.js");
const redis = require("redis");
const redisClient = redis.createClient(6379);
redisClient.connect();

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.data.username = username;
//   next();
// });

dotenv.config();

io.on("connection", (socket) => {
  var currentRoomId;
  console.log(`${socket.id} connected`);

  // socket.on("roomID", (data) => {
  //   socket.join(data.roomID);
  //   currentRoomId =  data.roomID;
  // });

  io.emit('id', {socketId: socket.id})

  socket.on('sendMessage', (data) => {
    var chat = data.roomId + 'chatLog'

    redisClient.get(chat)
      .then((result)=>{
        if (result === null) {
          var chatLog = []
          chatLog.push(data.message)
          redisClient.set(chat, JSON.stringify(chatLog))
          io.to(data.roomId.toString()).emit('message', chatLog)
        } else {
          var chatLog = JSON.parse(result)
          chatLog.push(data.message)
          redisClient.set(chat, JSON.stringify(chatLog))
          io.to(data.roomId.toString()).emit('message', chatLog)
        }
    })
  })


  socket.on("initRoom", (data) => {
    socket.join(data.roomID);
    currentRoomId = data.roomID;

    redisClient.get(data.roomID).then((result) => {

      if (result === null) {
        wordsRoutes
          .initGameState(data)
          .then((gameState) => {
            gameState.connection = {};
            gameState.connection[socket.id] = socket.id;
            gameState.roomID = data.roomID;
            gameState.host = socket.id;
            gameState.players[data.userID] = data.user;
            redisClient.set(data.roomID, JSON.stringify(gameState));
            io.to(data.roomID).emit("gameState", gameState);
          })
          .catch((err) => console.log(err));
      } else {
        var gameState = JSON.parse(result);
        gameState.connection = gameState.connection || {};
        gameState.connection[socket.id] = socket.id;
        if(gameState.host === undefined) {
          gameState.host = socket.id;
        }

        gameState.roomID = data.roomID;
        gameState.players[data.userID] = data.user;
        redisClient.set(data.roomID, JSON.stringify(gameState));
        io.to(data.roomID).emit("gameState", gameState);
      }
    });
  });

  socket.on('clue', (roomId, clue, clueNumber) => {
    io.to(roomId).emit('clue', clue, clueNumber);
  });

  socket.on('updateTeam', (roomID, teamInfo) => {
    // console.log('updateTeam: ', teamInfo)

    // retrieve game state from Redis database
    redisClient.get(roomID)
      .then(gameState => {
        gameState = JSON.parse(gameState);
        // console.log('Before update: ', gameState);

        // update team members
        const teamObj = gameState[`team_${teamInfo.team}_members`] || {};
        teamObj[teamInfo.userID] = teamInfo.user;

        // update team spymaster
        if (teamInfo.role === 'spymaster') {
          const spymaster = gameState[`team_${teamInfo.team}_spymaster`] || [];
          spymaster[0] = teamInfo.userID;
          spymaster[1] = teamInfo.user;
        }

        // console.log('after update: ', gameState);
        // update database
        redisClient.set(roomID, JSON.stringify(gameState));

        // send updated gameState back to clients
        io.to(roomID).emit("gameState", gameState);
      })

  })

  socket.on("gameLog", data => {
    var roomLog = data.roomID + 'gameLog';

    redisClient.get(roomLog)
    .then(result => {
      if (result=== null) {
        var gameLog = [];
        gameLog.push(data.text)
        redisClient.set(roomLog, JSON.stringify(gameLog))
        io.to(data.roomID).emit('gameLog', gameLog);
      }
      else{
        var gameLog = JSON.parse(result);
        gameLog.push(data.text);
        redisClient.set(roomLog, JSON.stringify(gameLog))
        io.to(data.roomID).emit('gameLog', gameLog);
      }
    })


  })

  socket.on("disconnect", (data) => {
    console.log(socket.id, "left");
    if(currentRoomId !== undefined) {
      redisClient.get(currentRoomId)
      .then( result => {

        var gameState = JSON.parse(result);
        delete gameState.connection[socket.id];
        if (socket.id === gameState.host) {
          gameState.host = undefined
          for(var i in gameState.connection) {
            console.log({i})
            gameState.host = i;
            redisClient.set(currentRoomId, JSON.stringify(gameState))
            io.to(gameState.roomID).emit('gameState', gameState)
            return;
          }
        }
        redisClient.set(currentRoomId, JSON.stringify(gameState))
        io.to(gameState.roomID).emit('gameState', gameState)
      })
      .catch(err => console.log(err))
    }

  });



  // socket.on('initialGameState', data => {

  //   redisClient.get(data.roomID)f
  //   .then(result => {

  //     if(result !== null) {
  //       io.to(data.roomID).emit('gameState', JSON.parse(result))
  //     }else{

  //       redisClient.set(data.roomID, JSON.stringify(data))

  //       io.to(data.roomID).emit('gameState', data)
  //     }
  //   })

  // })


  socket.on('cardSelection', (data, roomID, username) => {
    io.to(roomID).emit('selectedCard', data.word, username);
  })

  socket.on("disconnect", (data) => {
    console.log(socket.id, "left");
  });


});

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger(":method :url :status - :response-time ms"));

app.get("/", (req, res) => {
  res.json("Welcome to Blue Ocean! 🤗");
});

app.get("/user/:username", (req, res) => {
  usersRoutes.getUser(req, res);
});

app.post("/user", (req, res) => {
  usersRoutes.postUser(req, res);
});

app.patch("/nickname", (req, res) => {
  usersRoutes.patchNickname(req, res);
});

app.patch("/password", (req, res) => {
  usersRoutes.patchPassword(req, res);
});

app.get("/topics", (req, res) => {
  wordsRoutes.getTopics(req, res);
});

app.get("/allTopicWords", (req, res) => {
  wordsRoutes.getAllTopicWords(req, res);
});

app.get("/words/:topic", (req, res) => {
  wordsRoutes.getWords(req, res);
});

app.get("/initGame/:topic", (req, res) => {
  wordsRoutes.getInitGame(req, res);
});

app.post("/newTopic", (req, res) => {
  wordsRoutes.postNewTopic(req, res);
});

app.put("/addNewWords", (req, res) => {
  wordsRoutes.patchAddNewWords(req, res);
});

app.get("/groups", (req, res) => {
  groupsRoutes.getGroups(req, res);
});

app.get("/group/:groupName", (req, res) => {
  groupsRoutes.getGroup(req, res);
});

app.post("/group", (req, res) => {
  groupsRoutes.postGroup(req, res);
});

app.put("/groupMember", (req, res) => {
  groupsRoutes.putGroupMember(req, res);
});

app.delete("/groupMember", (req, res) => {
  groupsRoutes.deleteGroupMember(req, res);
});

app.patch("/groupName", (req, res) => {
  groupsRoutes.patchGroupName(req, res);
});

app.delete("/group/:groupName", (req, res) => {
  groupsRoutes.deleteGroup(req, res);
});

app.get("/history", (req, res) => {
  historyRoutes.getHistory(req, res);
})
app.post("/history", (req, res) => {
  historyRoutes.postHistory(req, res);
})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
  console.log(`Now running on http://localhost:${PORT}`)
);
