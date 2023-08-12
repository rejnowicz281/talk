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

export async function loginResponse(email, password) {
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
