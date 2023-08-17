import { create } from "zustand";
import getUserFromToken from "../helpers/getUserFromToken";
import socket from "./socket";

export const useAuthStore = create((set) => ({
    currentUser: null,
    logout: () => {
        localStorage.removeItem("token");
        set({ currentUser: null });
    },
    loginWithToken: async (token) => {
        const user = getUserFromToken(token);
        socket.emit("login", user);
        set({ currentUser: user });
    },
}));

export const useNavbarStore = create((set, get) => ({
    navbarRooms: [],
    setNavbarRooms: (rooms) => set({ navbarRooms: rooms }),
    addNavbarRoom: (room) => set({ navbarRooms: [...get().navbarRooms, room] }),
    removeNavbarRoom: (id) => set({ navbarRooms: get().navbarRooms.filter((room) => room._id !== id) }),
    updateNavbarRoom: (id, name) =>
        set({ navbarRooms: get().navbarRooms.map((room) => (room._id === id ? { ...room, name } : room)) }),
}));
