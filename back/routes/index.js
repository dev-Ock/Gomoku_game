const express = require("express");
const router = express.Router();
const logger = require('../lib/logger');

const authRouter = require("./auth");

const app = express()

router.use("/auth", authRouter);

// server test
app.get("/", (req, res, next) => {
    // res.render("home");
    console.log("브라우저 연결 완료")
    res.statusCode(200).json({
      message : "success"
    })
  });
  
app.get("/*", (req, res, next) => {
    res.redirect("/");
  });

module.exports = router;
