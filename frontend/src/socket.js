import { io } from "socket.io-client";
import { API_BASE_URL } from "./apiConfig";


// Create the socket instance with auto-connect disabled initially
// This gives you control over when the connection starts
export const socket = io(window.location.origin, {
    withCredentials: true,
    autoConnect: false,
    path: "/socket.io/"
});

// Helper functions to manage the connection
export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
