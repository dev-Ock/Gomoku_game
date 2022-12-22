const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        UserId : {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        win: {
          type: Sequelize.INTEGER(40),
          allowNull: false,
          defaultValue: 0,
        },
        lose: {
          type: Sequelize.INTEGER(40),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasOne(db.Room,{
      foreignKey: 'OwnerId'
    });
    db.User.hasMany(db.Chat);
  }
};
