import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  autoConnect: false,
});

export const connectSocket = () => {
  socket.auth = {
    token: localStorage.getItem("token"),
  };
  socket.connect();
};

export default socket;
