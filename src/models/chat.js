const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");
const Message = require("./message");

const Chat = sequelize.define(
  "chat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    secondUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["first_user_id", "second_user_id"],
        name: "unique_first_second_user",
      },
    ],
  }
);

Chat.belongsTo(User, {
  foreignKey: "firstUserId",
  as: "firstUser",
});

Chat.belongsTo(User, {
  foreignKey: "secondUserId",
  as: "secondUser",
});

Chat.hasMany(Message, {
  foreignKey: "chatId",
  as: "message",
});

module.exports = Chat;
