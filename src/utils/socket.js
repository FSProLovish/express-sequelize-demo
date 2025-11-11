const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const Message = require("../models/message");
const { Op } = require("sequelize");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server);

  io.on("connection", (socket) => {
    // Handle events

    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

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
          });

          chat = chat ? chat.toJSON() : null;

          if (!chat) {
            chat = await Chat.create({
              firstUserId: userId,
              secondUserId: targetUserId,
            });
          }

          await Message.create({
            chatId: chat.id,
            senderId: userId,
            text,
          });

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
