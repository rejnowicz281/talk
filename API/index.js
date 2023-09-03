import axios from "axios";
import { API_URL } from "../helpers/config";

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

export { api, apiAuth };
