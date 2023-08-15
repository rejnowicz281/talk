import jwt_decode from "jwt-decode";
import { create } from "zustand";
import { apiLogin, apiRegister } from "../helpers/API";

export const useAuthStore = create((set, get) => ({
    user: null,
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
    },
    login: async (email, password) => {
        const response = await apiLogin(email, password);

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            await get().setUserFromToken(response.data.token);
        }

        return response;
    },
    register: async (email, username, password, password_confirm) => {
        const response = await apiRegister(username, email, password, password_confirm);

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            await get().setUserFromToken(response.data.token);
        }

        return response;
    },
    setUserFromToken: async (token) => {
        const decodedToken = await jwt_decode(token);

        const decodedUser = {
            _id: decodedToken.sub,
            username: decodedToken.username,
        };

        set({ user: decodedUser });
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
