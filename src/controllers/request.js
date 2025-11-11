const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const send = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { toUserId, status } = req.params;

    // same userId not allowed
    if (fromUserId === Number.parseInt(toUserId)) {
      throw new Error("Not Allowed!!!");
    }

    // validation for allowed statuses
    const allowedStatuses = ["ignored", "interested"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status type = ${status}`);
    }

    // find the to user
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error(`User not found`);
    }

    // check if there is any existing `connection request`
    const existingConnectionRequest = await ConnectionRequest.findByFromToUser(
      fromUserId,
      toUserId
    );

    if (existingConnectionRequest) {
      throw new Error("Connection Request Already Sent!!!");
    }

    // create a new connection request
    await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    res.status(200).json({
      success: true,
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const review = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { requestId, status } = req.params;

    // validation for allowed statuses
    const allowedStatuses = ["rejected", "accepted"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status type = ${status}`);
    }

    // finding the connection request
    const connectionRequest = await ConnectionRequest.findById({
      id: requestId,
      toUserId: loggedInUser.id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new Error("Connection Request Not Found!");
    }

    // update connection request
    await ConnectionRequest.updateById({ status }, connectionRequest.id);

    res.status(200).json({
      success: true,
      message: "Connection Request " + status,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  send,
  review,
};
