const bcrypt = require("bcrypt");

// const iterations = 1005; // 반복횟수(1000번 이상)

const hashUtil = {
  // hash함수 생성
  makePasswordHash(password) {
    return new Promise((resolve, reject) => {
      if (!password) {
        reject(new Error("Not allowed null (password)"));
      }
      console.log(password);
      // 1. salt 생성
      const salt = bcrypt.genSalt(12);

      // 2. hashpassword 생성
      password = password.toString();
      const hashPassword = bcrypt.hash(password, parseInt(salt));

      resolve(hashPassword);
    });
  },

  // 비밀번호 확인
  checkPasswordHash(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      if (!password || !hashedPassword) {
        reject(new Error("Not allowed null (password)"));
      }

      // 입력된 password와 암호화된 password를 비교한다.
      password = password.toString();
      const result = bcrypt.compare(password, hashedPassword);

      if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
};

module.exports = hashUtil;
