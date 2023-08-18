import { io } from "socket.io-client";

const URL = "https://talk.fly.dev";

const socket = io(URL);

export default socket;
