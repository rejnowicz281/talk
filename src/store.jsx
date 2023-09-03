import { create } from "zustand";
import { apiLogout } from "../API/auth";
import getUserFromToken from "../helpers/getUserFromToken";
import socket from "./socket";

export const useAuthStore = create((set, get) => ({
    token: null,

    currentUser: null,

    login: async (token) => {
        const user = await getUserFromToken(token);

        socket.emit("login", user);
        set({ token, currentUser: user });
    },

    logout: async () => {
        await apiLogout();
        localStorage.removeItem("persist");
        socket.emit("logout", get().currentUser._id);
        set({ token: null, currentUser: null });
    },
}));

export const useMainSidebarStore = create((set) => ({
    mainSidebarOpen: false,
    toggleMainSidebar: () => set((state) => ({ mainSidebarOpen: !state.mainSidebarOpen })),
    closeMainSidebar: () => set({ mainSidebarOpen: false }),
}));
