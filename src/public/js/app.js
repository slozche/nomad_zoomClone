const socket = io();

const room = document.getElementById("room");
const roomForm = room.querySelector("form");
const message = document.getElementById("message");

message.hidden = true;

let roomName;

const addMessage = (msg) => {
    const ul = message.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = msg;
    ul.appendChild(li);
}

const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = message.querySelector("input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

const showRoom = () => {
    room.hidden = true;
    message.hidden = false;
    const h3 = message.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const messageForm = message.querySelector("form");
    messageForm.addEventListener("submit", handleMessageSubmit);
}

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    addMessage("Someone Joined!");
});

socket.on("bye", () => {
    addMessage("Someone Left.");
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});
