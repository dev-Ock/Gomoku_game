const { Op } = require("sequelize");
const { User } = require("../models/index");

const dao = {
  // 등록
  insert(params) {
    return new Promise((resolve, reject) => {
      User.create(params)
        .then((inserted) => {
          const insertedResult = { ...inserted };
          delete insertedResult.dataValues.password;
          // password는 제외하고 리턴함
          resolve(inserted);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 리스트 조회
  selectList(params) {
    // where 검색 조건

    // (자원 낭비될 수 있는 방식)
    // const setQuery = {};
    // if (params.name) {
    //   setQuery.where = {
    //     ...setQuery.where,
    //     name: { [Op.like]: `%${params.name}%` }, // like검색
    //   };
    // }
    // if (params.userid) {
    //   setQuery.where = {
    //     ...setQuery.where,
    //     userid: params.userid, // '='검색
    //   };
    // }

    // (자원 아낄 수 있는 방식)
    const setQuery = { where: {} };
    if (params.name) {
      setQuery.where["name"] = { [Op.like]: `%${params.name}%` }; // like검색
    }
    if (params.userid) {
      setQuery.where["userid"] = params.userid; // '='검색
    }

    // order by 정렬 조건
    setQuery.order = [["id", "DESC"]];

    return new Promise((resolve, reject) => {
      User.findAndCountAll({
        ...setQuery,
        attributes: { exclude: ["password"] }, // password 필드 제외
        // include: [
        //   {
        //     model: Department,
        //     as: 'Department',
        //   },
        // ],
      })
        .then((selectedList) => {
          resolve(selectedList);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // PK로 상세정보 조회
  selectInfo(params) {
    return new Promise((resolve, reject) => {
      User.findByPk()(
        // primary key로 조회하는 함수
        params.id,
        {
          attributes: { exclude: ["password"] }, // password 필드 제외
        }
      )
        .then((selectedInfo) => {
          resolve(selectedInfo);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 수정
  update(params) {
    return new Promise((resolve, reject) => {
      User.update(params, {
        where: { id: params.id },
      })
        .then(([updated]) => {
          resolve({ updatedCount: updated });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 삭제
  delete(params) {
    return new Promise((resolve, reject) => {
      User.destroy({
        where: { id: params.id },
      })
        .then((deleted) => {
          resolve({ deletedCount: deleted });
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // 사용자 조회
  selectUser(params) {
    return new Promise((resolve, reject) => {
      User.findOne({
        // attributes: ['id', 'userid', 'password', 'name', 'role'],
        where: { UserId: params.UserId },
      })
        .then((selectedOne) => {
          resolve(selectedOne);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = dao;
