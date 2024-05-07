const users = require("../controllers/users.controller.js");
const router = require("express").Router();
const { checkJwt } = require("../middleware/auth");

router.post("/", users.createOrUpdateUser);
router.get("/", users.listUsers);
router.get("/:sub", users.getUser);
router.put("/:sub", checkJwt, users.updateUser);
router.put("/:sub/follow", checkJwt, users.followUser);
router.put("/:sub/unfollow", checkJwt, users.unFollowUser);
router.get("/:sub/notifications", checkJwt, users.notifications);

module.exports = router;
