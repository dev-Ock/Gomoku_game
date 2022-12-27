import http from "http";
import express from "express";
import SocketIO from "socket.io";
// const debug = require('debug')('nodeproj:server');
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");

const { corsConfig } = require("../config/corsConfig");

const logger = require("../lib/logger");

dotenv.config({ path: "../config/.env" });

// 라우터 연결
const indexRouter = require("../routes");

// 시퀄랄이즈
const { sequelize } = require("../models");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT;
app.set("port", PORT);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
    logger.info("Sequelize sync success");
  })
  .catch((err) => {
    console.error(err);
    logger.error("Sequelize sync error", err);
  });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS 처리
app.use(cors(corsConfig));
// app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// router
app.use("/", indexRouter);

// http 서버
const httpServer = http.createServer(app);

// websocket 서버
const wsServer = SocketIO(httpServer);

//
let publicRoom = [];

//
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  // console.log("sids : ", sids);
  // console.log("rooms : ", rooms);
  rooms.forEach((_, key) => {
    // console.log("a", a);
    // console.log("key", key);
    // rooms의 key들 각각이 sids의 key중에 있는지 확인한다. 있으면 private room, 없으면 public room.
    // key 중에는 private key와 public key가 있다
    if (sids.get(key) === undefined) {
      // sids에 없는 key라면 public key를 말한다
      publicRooms.push(key); // public room의 key를 publicRooms 배열에 넣는다.
    }
  });
  console.log("publicRooms : ", publicRooms);
  return publicRooms;
}

wsServer.on("connection", (socket) => {
  // console.log("connection to browser");

  // socket.onAny((event) => {
  //   console.log(`Socket Event : ${event}`);
  // });

  // nickname default 설정
  socket["nickname"] = "무명";

  //방 목록 반환
  socket.on("room_list", () => {
    socket.emit("room_list", publicRoom);
  });

  //방 만들기
  socket.on("create_room", (name, done) => {
    console.log(`Socket ${socket.id} is creating room ${name}.`);

    //Socket은 ID와 같은 Room을 Default로 갖고 있음 (따라서, 기본적으로 socket.rooms.size == 1, 따라서 방을 만들기도 전에 1 초과라는 것은 이 사용자가 다른 방에 참가하고 있다는 뜻이다.)
    if (socket.rooms.size > 1) {
      console.log(`socket ${socket.id} is already in room.`);
      console.log(socket.rooms);
      socket.emit("error", "이미 다른 방에 참가중입니다.");
      return;
    }

    //동일한 방이 존재할 경우
    // if (wsServer.sockets.adapter.rooms.get(name)) {
    //   console.log(`Room name ${name} already exists.`);
    //   socket.emit("error", "동일한 방이 이미 존재합니다.");
    //   return;
    // }

    const roomInfo = {
      name,
      blackPlayer: "",
      whitePlayer: "",
      takes: [],
    };

    publicRoom.push(roomInfo);
    wsServer.sockets.emit("room_list", publicRoom);
    console.log("###");
    // enterRoom(socket, name);
    console.log(`Socket ${socket.id} is entering room ${name}.`);
    // socket.join(name)
    // done()
    // socket.emit("room_enter", name);
    // wsServer.to(name).emit("message", `${socket.id} 님이 입장하셨습니다.`);
  });

  //기존 방 참가
  socket.on("room_enter", (name) => {
    console.log("name : ", name);
    if (socket.rooms.size > 1) {
      console.log(`socket ${socket.id} is already in room.`);
      console.log(socket.rooms);
      socket.emit("error", "이미 다른 방에 참가중입니다.");
      return;
    }
    console.log(`Socket ${socket.id} is entering room ${name}.`);
    socket.join(name);
    wsServer
      .to(name)
      .emit("welcome_message", `${socket.id} 님이 입장하셨습니다.`);
  });

  // 게임 test
  socket.on("playGame", (message, socketID) => {
    console.log(message, socketID);
    socket.broadcast.emit("playGame", message);
    // wsServer.emit("playGame",message)
  });

  //
  socket.on("gameStatus", (history, board, roomName) => {
    console.log("history : ", history, board, roomName);
    // socket.to()
  });

  //
  socket.on("sendingBoard", (board) => {
    console.log("sendingBoard", board.sendingBoard);
    console.log("roomName", board.roomName);
    console.log("lastStone", board.lastStone);
    console.log("count", board.count);
    socket
      .to(board.roomName)
      .emit(
        "sendingBoard",
        board.sendingBoard,
        board.roomName,
        board.lastStone,
        board.count
      );
  });

  // 방 나가기
  // socket.on("room_leave", () => {
  //   const name = Array.from(socket.rooms)[1];
  //   console.log(`Socket ${socket.id} is leaving room ${name}.`);

  //   if (name != undefined) {
  //     //현재 Disconnect 하는 Socket이 해당 방의 마지막 소켓일 경우 방 제거
  //     if (wsServer.sockets.adapter.rooms.get(name).size == 1) {
  //       console.log(`Remove room ${name}`);
  //       publicRoom = publicRoom.filter((value) => value.name != name);
  //       wsServer.sockets.emit("room_list", publicRoom);
  //     } else {
  //       const room = getPublicRoom(name);
  //       if (room.blackPlayer === socket.id) {
  //         room.blackPlayer = "";
  //         emitPlayerChange(room);
  //       } else if (room.whitePlayer === socket.id) {
  //         room.whitePlayer = "";
  //         emitPlayerChange(room);
  //       }

  //       wsServer.to(name).emit("message", `${socket.id} 님이 퇴장하셨습니다.`);
  //     }
  //     socket.leave(name);
  //   }

  //   socket.emit("room_leave");
  // });

  // 참가자가 방을 나가는 중  // the Set contains at least the socket ID
  // Fired when the client is going to be disconnected (but hasn't left its rooms yet).
  socket.on("disconnecting", () => {
    // console.log("###socket.room### : ", socket);
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });

  // 참가자가 방을 나갈 때
  socket.on("disconnect", () => {
    // console.log("###sock.room### : ", socket);
    wsServer.sockets.emit("room_change", publicRooms());
  });

  // socket.on("enter_room", (roomName, done) => {
  //   // console.log("roomName : ", roomName);
  //   socket.join(roomName);
  //   done();
  //   socket.to(roomName).emit("welcome");
  // });

  // socket.on("new_message", (message, roomName, done) => {
  //   socket.to(roomName).emit("new_message", message); // emit한 socket을 제외하고 해당 roomName의 room에 있는 나머지 socket들에게 emit.
  //   done(message);
  // });
});

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? error : {};
  res.status(error.status || 500);
});

// app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기중");
// });

const handleListen = () => {
  console.log("Listening on http://localhost:3040");
};

httpServer.listen(app.get("port"), handleListen);
