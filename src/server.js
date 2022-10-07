import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
});

httpServer.listen(3000, handleListen);
