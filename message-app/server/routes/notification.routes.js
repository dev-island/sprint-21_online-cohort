const notifications = require("../controllers/notifications.controller.js");
const router = require("express").Router();

router.get("/", notifications.list);

module.exports = router;
