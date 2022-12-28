const express = require("express");
const { User } = require("../models");
const router = express.Router();
const logger = require("../lib/logger");
const userService = require("../service/userService");
const bcrypt = require("bcrypt");

// 회원가입 userid 중복 검사
router.post("/signup/userid-check", async (req, res, next) => {
  console.log("POST /auth/signup/userid-check 진입");
  try {
    const params = {
      UserId: req.body.UserId,
    };
    logger.info(`(/signup/userid-check params) ${JSON.stringify(params)}`);

    // 입력값 null값 체크
    if (!params.UserId) {
      const err = new Error("Not allowed null (UserId)");
      logger.error(err.toString());
      res.status(500).json({
        err: err.toString(),
      });
    }

    // 비즈니스 로직 호출
    const duplicationUser = await userService.duplicationCheck(params);
    logger.info(
      `(/signup/userid-check duplicationUser) ${JSON.stringify(
        duplicationUser
      )}`
    );

    // 최종 응답
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ err: err.toString() });
  }
});

// 회원가입 최종 절차
router.post("/signup", async (req, res, next) => {
  console.log("POST /auth/signup 진입");
  try {
    console.log(req.body);
    console.log("###", req.body.UserId);
    console.log("###", req.body.password);
    const params = {
      UserId: req.body.UserId,
      password: req.body.password,
    };
    logger.info(`(/signup params) ${JSON.stringify(params)}`);

    // 입력값 null값 체크
    if (!params.UserId || !params.password) {
      const err = new Error("Not allowed null (UserId, password)");
      logger.error(err.toString());
      res.status(500).json({
        err: err.toString(),
      });
    }
    console.log("params : ", params);

    // 비즈니스 로직 호출
    const duplicationUser = await userService.reg(params);
    logger.info(`(/signup duplicationUser) ${JSON.stringify(duplicationUser)}`);

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({ err: err.toString() });
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  console.log("POST /auth/login 진입");
  try {
    const params = {
      UserId: req.body.UserId,
      password: req.body.password,
    };
    if (!params.UserId || !params.password) {
      const err = new Error("Not allowed null (UserId, password)");
      logger.error(err.toString());
      res.status(500).json({
        err: err.toString(),
      });
    }

    // 비즈니스 로직 호출 (user 조회 -> 비번 비교 확인 -> user 비번 제외하고 조회)
    const user = await userService.login(params);
    logger.info(`(/login user) ${JSON.stringify(user)}`);

    // 최종 응답
    res.status(200).json({ message: "success", data: { user } });
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

module.exports = router;
