const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");

const ConnectionRequest = sequelize.define(
  "connectionRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("ignored", "rejected", "accepted", "interested"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "connection_request",
    indexes: [
      {
        unique: true,
        fields: ["from_user_id", "to_user_id"],
        name: "unique_from_to_user",
      },
    ],
  }
);

// Define associations
// ConnectionRequest belongs to User (as sender)
ConnectionRequest.belongsTo(User, {
  foreignKey: "fromUserId",
  as: "fromUser",
});

// ConnectionRequest belongs to User (as receiver)
ConnectionRequest.belongsTo(User, {
  foreignKey: "toUserId",
  as: "toUser",
});

ConnectionRequest.findById = async function ({ id, toUserId, status }) {
  const connectionRequest = await ConnectionRequest.findOne({
    raw: true,
    where: {
      id,
      toUserId,
      status,
    },
  });
  return connectionRequest;
};

ConnectionRequest.findByFromToUser = async function (fromUserId, toUserId) {
  const connectionRequest = await ConnectionRequest.findOne({
    raw: true,
    where: {
      [Op.or]: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    },
  });

  return connectionRequest;
};

ConnectionRequest.updateById = async function (data, id) {
  await ConnectionRequest.update(data, { where: { id } });
};

module.exports = ConnectionRequest;
