const WebSocket = require("ws");

let ws;

const connectToWebSocket = () => {
  const wsUrl = process.env.WS_URL;
  if (!wsUrl) {
    console.error("WebSocket URL is not defined");
    return;
  }

  ws = new WebSocket(wsUrl, {
    headers: {
      "user-agent": "API CLIENT",
    },
  });

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

const broadcast = (data) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.log("WebSocket is closed. Reconnecting...");
    connectToWebSocket();

    setTimeout(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      } else {
        console.log("Still unable to connect, please try again later.");
      }
    }, 3000);
  } else {
    ws.send(JSON.stringify(data));
  }
};

connectToWebSocket();

module.exports = { connectToWebSocket, broadcast };
