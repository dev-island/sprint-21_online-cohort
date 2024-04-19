const WebSocket = require("ws");

const broadcast = (clients, message, targetUserId) => {
  if (!clients || !clients.size) {
    return;
  }
  clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) {
      return;
    }
    if (targetUserId && client?.userId !== targetUserId) {
      return;
    }

    client.send(JSON.stringify(message));
  });
};

module.exports = {
  broadcast,
};
