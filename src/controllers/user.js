const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { Op } = require("sequelize");
const USER_SAFE_DATA = [
  "id",
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
];

const requests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.findAll({
      where: {
        toUserId: loggedInUser.id,
        status: "interested",
      },
      attributes: ["id", "status"],
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: USER_SAFE_DATA,
        },
      ],
    });

    // Convert to JSON to get nested structure
    const data = connectionRequests.map((request) => request.toJSON());

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const connections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.findAll({
      where: {
        [Op.or]: [
          {
            toUserId: loggedInUser.id,
          },
          {
            fromUserId: loggedInUser.id,
          },
        ],
        status: "accepted",
      },
      attributes: ["id", "status"],
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: USER_SAFE_DATA,
        },
        {
          model: User,
          as: "toUser",
          attributes: USER_SAFE_DATA,
        },
      ],
    });

    // Convert to JSON to get nested structure
    const data = connectionRequests
      .map((request) => request.toJSON())
      .map((row) => {
        if (row.fromUser.id === loggedInUser.id) {
          return row.toUser;
        }
        return row.fromUser;
      });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  requests,
  connections,
};
