import axios from "axios";
import { API_URL } from "../helpers/config";

// Used for authentication - interceptors set in App.js
const apiAuth = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export { api, apiAuth };
