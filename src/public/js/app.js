const socket = io();

const welcome = document.getElementById("welcome");
const nameForm = welcome.querySelector("#name");
const enterForm = welcome.querySelector("#enter");
const room = document.getElementById("room");

room.hidden = true;
enterForm.hidden = true;

let roomName;

const addMessage = (msg) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = msg;
    ul.appendChild(li);
}

const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

const handleNicknameSubmit = (event) => {
    event.preventDefault();
    nameForm.hidden = true;
    enterForm.hidden = false;
    const input = nameForm.querySelector("input");
    socket.emit("nickname", input.value);
    input.value = "";
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = enterForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left.`);
});

socket.on("new_message", (msg) => {
    addMessage(msg);
});
