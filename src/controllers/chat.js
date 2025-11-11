const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");
const { Op } = require("sequelize");

const chat = async (req, res) => {
  const { targetUserId: id } = req.params;
  const userId = req.user.id;
  const targetUserId = Number.parseInt(id);

  try {
    if (userId === targetUserId) {
      throw new Error("Not Allowed!!!");
    }

    // Check for chat in both directions (like socket.js)
    let chat = await Chat.findOne({
      where: {
        [Op.or]: [
          {
            firstUserId: userId,
            secondUserId: targetUserId,
          },
          {
            firstUserId: targetUserId,
            secondUserId: userId,
          },
        ],
      },
      include: [
        {
          model: Message,
          as: "message",
          attributes: ["text"],
          separate: true, // Separate query for messages to enable ordering
          order: [["createdAt", "ASC"]], // Oldest messages first
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
    });

    // Convert to JSON to get nested structure
    chat = chat ? chat.toJSON() : null;

    // If chat doesn't exist, return empty chat structure
    if (!chat) {
      chat = {
        id: null,
        firstUserId: userId,
        secondUserId: targetUserId,
        message: [],
        createdAt: null,
        updatedAt: null,
      };
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  chat,
};
