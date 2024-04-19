// Create a mongoose schema for the user model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SocketUserSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  connectionId: String,
});

module.exports = mongoose.model("SocketUser", SocketUserSchema);
