import axios from "axios";

const API_URL = "http://localhost:3000/";

const apiAuth = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const api = axios.create({
    baseURL: API_URL,
});

export async function apiLogin(email, password) {
    try {
        const response = await api.post("login", {
            email,
            password,
        });

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function apiRegister(username, email, password, password_confirm) {
    try {
        const response = await api.post("register", {
            username,
            email,
            password,
            password_confirm,
        });

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchUserData(username) {
    try {
        const response = await api.get(`users/${username}`);

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchRooms() {
    try {
        const response = await apiAuth.get("rooms");

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchRoom(roomId) {
    try {
        const response = await apiAuth.get(`rooms/${roomId}`);

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchCreateRoom(name) {
    try {
        const response = await apiAuth.post("rooms", {
            name,
        });

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchUpdateRoom(roomId, name) {
    try {
        const response = await apiAuth.put(`rooms/${roomId}`, {
            name,
        });

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchDeleteRoom(roomId) {
    try {
        const response = await apiAuth.delete(`rooms/${roomId}`);

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchLeaveRoom(roomId, userId) {
    try {
        const response = await apiAuth.delete(`rooms/${roomId}/chatters/${userId}`);

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchJoinRoom(roomId) {
    try {
        const response = await apiAuth.post(`rooms/${roomId}/chatters/join`);

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchCreateMessage(roomId, text) {
    try {
        const response = await apiAuth.post(`rooms/${roomId}/messages`, {
            text,
        });

        return response;
    } catch (error) {
        return error.response;
    }
}
