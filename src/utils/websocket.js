const { getWebSocketServer } = require("../websocket");

const broadcast = (data) => {
  const wss = getWebSocketServer();
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { broadcast };
