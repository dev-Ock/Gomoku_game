const express = require("express");
const router = express.Router();
const logger = require('../lib/logger');

const authRouter = require("./auth");

// router.use("/auth", authRouter);

// server test
router.get("/",(req,res,next)=>{
    console.log("hello")
    logger.info(`main access success`);
    res.status(200).json({
        message : "success"
    })
})

module.exports = router;
