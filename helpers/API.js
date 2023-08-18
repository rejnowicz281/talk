import axios from "axios";

const API_URL = "https://talk.fly.dev/";

const apiAuth = axios.create({
    baseURL: API_URL,
});

apiAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

export async function apiRegister(email, username, password, password_confirm, avatar) {
    try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("password_confirm", password_confirm);
        formData.append("avatar", avatar);

        const response = await api.post("register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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

export async function fetchCreateMessage(roomId, text, photo) {
    try {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("photo", photo);

        const response = await apiAuth.post(`rooms/${roomId}/messages`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        return error.response;
    }
}

export async function fetchDeleteMessage(roomId, messageId) {
    try {
        const response = await apiAuth.delete(`rooms/${roomId}/messages/${messageId}`);

        return response;
    } catch (error) {
        return error.response;
    }
}
