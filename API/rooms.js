import { apiAuth } from ".";

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
