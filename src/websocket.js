const { WebSocketServer } = require("ws");

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  console.log("WebSocket server initialized");
};

const getWebSocketServer = () => {
  if (!wss) {
    throw new Error("WebSocket server is not initialized");
  }
  return wss;
};

module.exports = { initializeWebSocket, getWebSocketServer };
