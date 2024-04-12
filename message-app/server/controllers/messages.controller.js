const Message = require("../models/Message");
const User = require("../models/User");
const { broadcast } = require("../helpers/websockets");

const response = require("../helpers/response");

exports.createMessage = async (req, res) => {
  let statusCode = 200;
  try {
    if (!req?.body) {
      statusCode = 400;
      throw new Error("Request body is missing");
    }

    const { body, _id } = req.body;
    if (!body || !_id) {
      statusCode = 400;
      throw new Error("Missing required fields");
    }
    // Ensure the user exists
    const user = await User.findById(_id);
    if (!user) {
      statusCode = 400;
      throw new Error("User does not exist");
    }

    const newMessage = new Message({ body, author: _id });
    await newMessage.save();
    console.log(newMessage);

    const clients = req.app.locals.clients;
    const message = {
      data: newMessage,
      type: "NEW_MESSAGE",
    };
    broadcast(clients, message);

    return response({
      res,
      status: 201,
      message: "Message created",
      data: {
        ...newMessage.toObject(),
        author: user,
        likes: [],
      },
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: statusCode,
      message: error.message,
    });
  }
};

exports.listMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("author")
      .populate("likes")
      .sort({ createdDate: -1 });
    return response({
      res,
      status: 200,
      message: "Messages retrieved",
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: 500,
      message: "Server error",
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return response({
        res,
        status: 400,
        message: "Missing required fields",
      });
    }

    const message = await Message.findById(_id)
      .populate("author")
      .populate("likes");
    return response({
      res,
      status: 200,
      message: "Message retrieved",
      data: message,
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: 500,
      message: "Server error",
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return response({
        res,
        status: 400,
        message: "Missing required fields",
      });
    }

    const message = await Message.findByIdAndDelete(_id);
    if (!message) {
      return response({
        res,
        status: 404,
        message: "Message not found",
      });
    }

    return response({
      res,
      status: 200,
      message: "Message deleted",
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: 500,
      message: "Server error",
    });
  }
};

exports.likeMessage = async (req, res) => {
  try {
    const { _id } = req.params;
    const { userId } = req.body;
    console.log("LIKE MESSAGE", {
      _id,
      userId,
    });
    if (!_id || !userId) {
      return response({
        res,
        status: 400,
        message: "Missing required fields",
      });
    }

    const message = await Message.findById(_id);
    if (!message) {
      return response({
        res,
        status: 404,
        message: "Message not found",
      });
    }
    let successMessage = "Message liked";
    if (message.likes.includes(userId)) {
      successMessage = "Message unliked";
      message.likes.pull(userId);
    } else {
      message.likes.push(userId);
    }

    const authorId = message.author;
    const author = await User.findById(authorId);
    if (!author) {
      return response({
        res,
        status: 404,
        message: "Author not found",
      });
    }

    if (successMessage === "Message liked") {
      author.postsLiked.push(_id);
    } else {
      author.postsLiked.pull(_id);
    }
    await author.save();

    await message.save();

    return response({
      res,
      status: 200,
      message: successMessage,
      data: message,
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: 500,
      message: "Server error",
    });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { _id } = req.params;
    const { userId, body } = req.body;
    if (!_id || !userId || !body) {
      return response({
        res,
        status: 400,
        message: "Missing required fields",
      });
    }

    const message = await Message.findById(_id);
    if (!message) {
      return response({
        res,
        status: 404,
        message: "Message not found",
      });
    }
    console.log("message.author", message.author);
    if (message.author.toString() !== userId) {
      return response({
        res,
        status: 403,
        message: "Unauthorized",
      });
    }

    const newMessage = await Message.findByIdAndUpdate(
      _id,
      { body },
      { new: true }
    );
    await newMessage.save();

    return response({
      res,
      status: 200,
      message: "Message updated",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    return response({
      res,
      status: 500,
      message: "Server error",
    });
  }
};
