const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const Path = require('path')
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
          var temp = {};
          temp['message'] = data.message
          temp['user'] = data.user
          chatLog = [temp]
          redisClient.set(chat, JSON.stringify(chatLog), {EX: 60*60*24})
          io.to(data.roomId.toString()).emit('message', chatLog)
        } else {
          var chatLog = JSON.parse(result)
          var temp = {};
          temp['message'] = data.message
          temp['user'] = data.user
          chatLog.push(temp)
          redisClient.set(chat, JSON.stringify(chatLog), {EX: 60*60*24})
          io.to(data.roomId.toString()).emit('message', chatLog)
        }
    })
  })

  socket.on('resetVote', (roomID) => {
    
    io.to(roomID).emit('resetVote');

    }
  )

  socket.on("initRoom", (data) => {
    socket.join(data.roomID);
    currentRoomId = data.roomID;

    redisClient.get(data.roomID).then((result) => {

      if (result === null) {
        wordsRoutes
          .initGameState(data)
          .then((gameState) => {
            gameState.stage = 'init';
            gameState.connection = {};
            gameState.connection[socket.id] = socket.id;
            gameState.roomID = data.roomID;
            gameState.host = socket.id;
            gameState.team_1 = data.team_1 || 'team_1';
            gameState.team_2 = data.team_2 || 'team_2';
            gameState.team_1_score = 0;
            gameState.team_2_score = 0;
            gameState.winner_score = 0;
            gameState.score = 1;
            gameState.teamWon = '';
            gameState.winReason = '';
            gameState.clue = 'waiting on clue...'
            gameState.remainingGuesses = '?';
            gameState.players[data.userID] = data.user;
            redisClient.set(data.roomID, JSON.stringify(gameState), {EX: 60*60*24});
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
        redisClient.set(data.roomID, JSON.stringify(gameState), {EX: 60*60*24});
        io.to(data.roomID).emit("gameState", gameState);
      }
    });
  });

  socket.on('clue', (roomId, clue, clueNumber) => {
    io.to(roomId).emit('clue', clue, clueNumber);
  });

  socket.on('updateTeam', (roomID, teamInfo) => {

    // retrieve game state from Redis database
    redisClient.get(roomID)
      .then(gameState => {
        gameState = JSON.parse(gameState);

        // update team members
        const teamObj = gameState[`team_${teamInfo.team}_members`] || {};
        teamObj[teamInfo.userID] = teamInfo.user;

        // update team spymaster
        if (teamInfo.role === 'spymaster') {
          const spymaster = gameState[`team_${teamInfo.team}_spymaster`] || [];
          spymaster[0] = teamInfo.userID;
          spymaster[1] = teamInfo.user;
        }

        if (teamInfo.change) {
          if (teamInfo.role === 'spymaster') {
            gameState[`team_${teamInfo.team}_spymaster`] = []
          }
          delete gameState[`team_${teamInfo.team}_members`][teamInfo.userID]
        }

        // update database
        redisClient.set(roomID, JSON.stringify(gameState), {EX: 60*60*24});

        // send updated gameState back to clients
        io.to(roomID).emit("gameState", gameState);
      })

  })

  socket.on('updateStage', (roomID, nextStage) => {

    // retrieve game state from Redis database
    redisClient.get(roomID)
      .then(gameState => {
        gameState = JSON.parse(gameState);

        // update game stage
        // ['init', 'play', 'result']
        gameState.stage = nextStage;

        // update database
        redisClient.set(roomID, JSON.stringify(gameState), {EX: 60*60*24});

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
        redisClient.set(roomLog, JSON.stringify(gameLog), {EX: 60*60*24})
        io.to(data.roomID).emit('gameLog', gameLog);
      }
      else{
        var gameLog = JSON.parse(result);
        gameLog.push(data.text);
        redisClient.set(roomLog, JSON.stringify(gameLog), {EX: 60*60*24})
        io.to(data.roomID).emit('gameLog', gameLog);
      }
    })


  })

  socket.on('getlogs', (data)=> {
    var gameLog = data + "gameLog"
    var chatLog = data + 'chatLog'
    redisClient.get(gameLog)
    .then(result => {
      let temp = result || '[]';
      socket.emit('gameLog', JSON.parse(temp))
    })
    .catch(err => console.log(err))

    redisClient.get(chatLog)
    .then(result => {
      let temp = result || '[]';
      socket.emit('message', JSON.parse(temp))
    })
    .catch(err => console.log(err))
  })

  
  socket.on('gameState', data => {
    redisClient.set(data.roomID, JSON.stringify(data), {EX: 60*60*24});
    io.to(data.roomID).emit('gameState', data);
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
            gameState.host = i;
            redisClient.set(currentRoomId, JSON.stringify(gameState), {EX: 60*60*24})
            io.to(gameState.roomID).emit('gameState', gameState)
            return;
          }
        }
        redisClient.set(currentRoomId, JSON.stringify(gameState), {EX: 60*60*24})
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

  // socket.on("disconnect", (data) => {
  // });


});

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(logger(":method :url :status - :response-time ms"));

app.use(express.static(Path.join(__dirname, '../../client/dist')))

app.get("/", (req, res) => {
  res.sendFile(Path.join(__dirname, '../../client/dist, index.html'))
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../client/dist', 'index.html'))
})

app.get('/room/:id', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../client/dist', 'index.html'))
})

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
