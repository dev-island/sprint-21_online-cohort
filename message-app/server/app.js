require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const messagesRouter = require("./routes/message.routes");
const usersRouter = require("./routes/user.routes");
const port = process.env.PORT || "3000";
const WebSocket = require("ws");
// const { auth } = require("express-openid-connect");

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: AUTH0_SECRET,
//   baseURL: "http://localhost:3000",
//   clientID: "9qW51jDdDqBMsxLWj0JEFEDyaFop4dup",
//   issuerBaseURL: "https://dev-iwo3s7ya82pzsqds.us.auth0.com",
// };

// Connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then((db) => {
    console.log("Connected to MongoDB");
    return db;
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.set("port", port);

const server = http.createServer(app);
const ws = new WebSocket.Server({ server });

ws.on("connection", (webSocket) => {
  console.info("Total connected clients:", ws.clients.size);
  ws.clients.forEach((client) => console.log(client));
  app.locals.clients = ws.clients;
});

// main user dashboard GET

// app.use(auth(config));
app.use("/messages", messagesRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.get("/", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
