import { create } from "zustand";
import getUserFromToken from "../helpers/getUserFromToken";
import socket from "./socket";

export const useAuthStore = create((set, get) => ({
    currentUser: null,
    logout: () => {
        localStorage.removeItem("token");
        socket.emit("logout", get().currentUser._id);
        set({ currentUser: null });
    },
    loginWithToken: async (token) => {
        const user = await getUserFromToken(token);
        socket.emit("login", user);
        set({ currentUser: user });
    },
}));

export const useMainSidebarStore = create((set) => ({
    mainSidebarOpen: false,
    toggleMainSidebar: () => set((state) => ({ mainSidebarOpen: !state.mainSidebarOpen })),
}));
