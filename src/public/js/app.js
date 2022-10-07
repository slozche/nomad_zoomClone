const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.append(option);
    });
  } catch (err) {
    console.log(err);
  }
};

const getMedia = async (deviceId) => {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstranins = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstranins : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (err) {
    console.log(err);
  }
};

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};

const handleCameraClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
};

const handleCameraChange = async () => {
  await getMedia(camerasSelect.value);
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

// welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

const startMedia = () => {
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
};

const handleWelcomeSubmit = (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startMedia);
  roomName = input.value;
  input.value = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", () => {
  console.log("Someone joined!");
});
