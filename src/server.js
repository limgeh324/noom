import http from "http";
import WebSocket from "ws";
import express from "express";
import path from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/*", (req, res) => {
  res.redirect("/");
});

const handleListen = () => {
  console.log("Listening on port http://localhost:3000");
};

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Client ✅");
  socket.on("close", () => {
    console.log("Disconnected to Client ❌");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket.nickname}: ${message.payload}`);
        });
        break;
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, handleListen);
