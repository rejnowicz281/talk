import { api } from ".";

export async function fetchUserData(username) {
    try {
        const response = await api.get(`users/${username}`);

        return response;
    } catch (error) {
        return error.response;
    }
}
