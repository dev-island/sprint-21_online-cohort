const Notification = require('../models/Notification');

exports.list = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdDate: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}