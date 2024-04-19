// Create a mongoose schema for the user model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  action: {
    type: String,
    required: true,
    enum: ["LIKE", "FOLLOW", 'NEW_MESSAGE'],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
