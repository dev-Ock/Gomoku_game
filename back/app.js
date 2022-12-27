const express = require("express");
const debug = require('debug')('nodeproj:server');
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
// const webSocket = require("./socket"); //nana1
var server = require('http').createServer(app); //nana2
var io = require('socket.io')(server); //nana2

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
io.on('connection' , function(socket) {
  console.log('Connect from Client: '+socket)

  socket.on('chat', function(data){
      console.log('message from Client: '+data.message)

      var rtnMessage = {
          message: data.message
      };

      // 클라이언트에게 메시지를 전송한다
      socket.broadcast.emit('chat', rtnMessage);
  });


})

server.listen(3001, function() {
  console.log('socket io server listening on port 3001')
})



// const logger = require('./lib/logger');

// dotenv.config({ path: "./config/.env" });
  
// // 라우터 연결
// const indexRouter = require("./routes")

// // 시퀄랄이즈
// const { sequelize } = require("./models");

// const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// const PORT = process.env.PORT;
// app.set("port", PORT);

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("데이터베이스 연결 성공");
//     logger.info('Sequelize sync success');
//   })
//   .catch((err) => {
//     console.error(err);
//     logger.error('Sequelize sync error', err);

//   });

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// app.use(cors());

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//   })
// );

// app.use("/", indexRouter);

// app.use((req, res, next) => {
//   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.locals.message = error.message;
//   res.locals.error = process.env.NODE_ENV !== "production" ? error : {};
//   res.status(error.status || 500);
// });

// app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기중");
// });

// module.exports = app;


// webSocket(wsServer, app); //nana1