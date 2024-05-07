const notifications = require("../controllers/notifications.controller.js");
const router = require("express").Router();

router.get("/", notifications.list);
router.put("/:id", notifications.markRead);

module.exports = router;
