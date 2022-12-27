// import {Server} from 'socket.io';
// import http from 'http';
// import {instrument} from "@socket.io/admin-ui"
// import { parse } from 'path';
var app = require('express')();
var server = require('http').createServer(app); //nana2
var io = require('socket.io')(server); //nana2:해당서버를 소켓서버로 설정

module.exports = (wsServer, app) => {
    
    
    
    //setting cors 
    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
    
    app.get('/', function(req, res) {
      res.sendFile('Hellow Chating App Server');
    });
    
    //connection event handler
    io.on('connection' , function(socket) { // nana: connection을 수립하고 callback인자로 socket을 받음
      console.log('Connect from Client: '+ socket)
    
      socket.on('chat', function(data){ // nana: 클라이언트로부터 chat이라는 이벤트 명을 사용해 메세지를 전달받음
          console.log('message from Client: '+data.message)
    
          var rtnMessage = {
              message: data.message
          };
    
          // 클라이언트에게 메시지를 전송한다
          socket.broadcast.emit('chat', rtnMessage); //nana: 클라이언트로'chat'이라는z
      });
    
    
    })
    
    server.listen(3001, function() {
      console.log('socket io server listening on port 3001')
    })
    
    


//     // const app = express(); //nana:app.js에서 받아오니까    
//     // app.set("view engine", "ejs");
    
//     app.set("views", __dirname + "/views");
//     app.use("/public", express.static(__dirname + "/public"));
//     app.get("/", (_, res) => res.render("home"));
//     app.get("/*", (_, res) => res.redirect("/"));
    
//     const httpServer = http.createServer(app);
//     const wsServer = new Server(httpServer, {
//         cors: {
//             origin: ["https://admin.socket.io"],
//             credentials: true,
//         },
//     });

//     instrument(wsServer, {
//         auth: false
//     });
    
//     function publicRooms() {
//         const {
//             sockets: {
//                 adapter: { sids, rooms },
//             },
//         } = wsServer;
//         const publicRooms = [];
//         rooms.forEach((_, key) => {
//             if(sids.get(key) === undefined){
//                 publicRooms.push(key);
//             }
//     });
//     return publicRooms;
// }

// function countRoom(roomName){
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size
// }

// wsServer.on("connection", (socket) => {
//     socket["nickname"] = "Anon";
//     socket.onAny((event) => {
//         console.log(wsServer.sockets.adapter);
//         console.log(`Socket Event:${event}`);
//     });
//     socket.on("enter_room", (roomName, done) => {
//         // console.log(socket.id);
//         // console.log(socket.rooms);
//         socket.join(roomName);
//         // console.log(socket.rooms);
//         // setTimeout(() => {
//             //     done("hello from the backend");
//             // }, 15000);
//             done();
//             socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//             wsServer.sockets.emit("room_change", publicRooms());
//         });
//         socket.on("disconnecting", () => {
//             socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
//         });
//         socket.on("disconnect", () => {
//             wsServer.sockets.emit("room_change", publicRooms());
//         })
//         socket.on("new_message", (msg, room, done) => {
//     socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//     done();
//   });
//   socket.on("nickname", nickname => socket["nickname"] = nickname)
// });
// // const wss = new WebSocket.Server({ server });

// // const sockets = [];

// // wss.on("connection", (socket) => {
//     //     sockets.push(socket);
//     //     socket["nickname"] = "Anon";
//     //     console.log("Connected to Browser 📌");
//     //     socket.on("close", () => {
//         //         console.log("Disconnected from Browser ✂")
//         //     });
//         //     socket.on("message", (msg) => {
//             //         const message = JSON.parse(msg);
//             //         switch (message.type) {
//                 //             case "new_message":
//                 //                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 //             case "nickname":
//                 //                 socket["nickname"] = message.payload;
//                 //         }
//                 //     });
//                 // });
// // const handeleListen = () => console.log(`Listening on http://localhost:3001`);
// // httpServer.listen(3001, handeleListen);
}