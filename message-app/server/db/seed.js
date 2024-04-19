require("dotenv").config();
const User = require("../models/User");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const { faker } = require("@faker-js/faker");
const connect = require("./index");

const generateUsers = () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = {
      username: faker.internet.userName({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      profileImage: faker.image.avatar(),
      joinedDate: faker.date.recent({ days: 365 }),
      displayName: faker.person.fullName({ firstName, lastName }),
      sub: faker.string.uuid(),
    };
    users.push(user);
  }
  return users;
};

const generateLikes = (users, messageAuthor) => {
  const likes = [];
  const likeNotifications = [];
  const numLikes = faker.helpers.rangeToNumber({ min: 0, max: 10 });
  if (!numLikes) return likes;

  for (let i = 0; i < numLikes; i++) {
    const user = faker.helpers.arrayElement(users);
    likes.push(user._id);
    likeNotifications.push({
      action: "LIKE",
      recipient: messageAuthor,
      actor: user._id,
    });
  }
  return {
    likes,
    likeNotifications,
  };
};

const generateMessages = (users) => {
  const messages = [];
  let notifications = {
    likeNotifications: [],
    followNotifications: [],
    newMessageNotifications: [],
  };

  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users);
    const { likes, likeNotifications } = generateLikes(users, user._id);
    notifications.likeNotifications = likeNotifications;
    const message = {
      author: user._id,
      body: faker.lorem.sentence(),
      createdDate: faker.date.recent({ days: 365 }),
      likes,
    };
    messages.push(message);
  }
  return {
    messages,
    notifications,
  };
};

const dropCollections = async () => {
  await User.collection.drop();
  await Message.collection.drop();
  await Notification.collection.drop();
};

// Connect to MongoDB via Mongoose
const insertData = async () => {
  try {
    const userData = generateUsers();
    const users = await User.insertMany(userData).catch((err) =>
      console.error(err)
    );
    // console.log("USERS", users)
    const { messages, notifications } = generateMessages(users);
    await Message.insertMany(messages);
    const newNotifications = await Notification.insertMany(notifications.likeNotifications);
    console.log("NOTIFICATIONS", newNotifications)
    console.log("Seeded User collection");
  } catch (err) {
    console.error(err);
    console.log("failed to seed, exiting...");
  }
  process.exit();
};

const seed = async () => {
  await connect();
  await dropCollections();
  await insertData();
};

seed();
