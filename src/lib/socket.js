import { CONFIG } from "@/constants";
import { io } from "socket.io-client";

export const createSocketConnection = () => {
  // if (isLocal) {
  //   return io(CONFIG.SOCKET_BACKEND_URL);
  // } else {
  //   return io("/", { path: "/socket.io" });
  // }
  return io(CONFIG.SOCKET_BACKEND_URL);
};
