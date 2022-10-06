import http from "http";
import SocketIO from "socket.io"
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/public/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
// app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

io.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
    });
})

// const sockets = [];
// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     socket.on('close', () => console.log("Disconnected from the Browser ❎"));
//     socket.on('message', (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "newMessage":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload.toString('utf8')}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 console.log(message.payload);
//         }
//     })
// })

httpServer.listen(3000, handleListen)