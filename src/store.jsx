import jwt_decode from "jwt-decode";
import { create } from "zustand";
import { loginResponse } from "../helpers/API";

export const useAuthStore = create((set, get) => ({
    user: null,
    logout: () => {
        localStorage.removeItem("token");
        set({ user: null });
    },
    login: async (email, password) => {
        const response = await loginResponse(email, password);

        if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            await get().setUserFromToken(response.data.token);
        }

        return response;
    },
    setUserFromToken: async (token) => {
        const decodedToken = await jwt_decode(token);

        const decodedUser = {
            id: decodedToken.sub,
            name: decodedToken.username,
        };

        set({ user: decodedUser });
    },
}));
