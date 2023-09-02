import { io } from "socket.io-client";
import { API_URL } from "../helpers/config";

const socket = io(API_URL);

export default socket;
