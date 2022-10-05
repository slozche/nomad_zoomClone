const socket = io();

const wolcome = document.getElementById("welcome");
const form = wolcome.querySelector("form");

const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value });
    input.value ="";
}

form.addEventListener("submit", handleRoomSubmit)