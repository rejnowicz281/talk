import { api } from ".";

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

export async function apiDemoLogin() {
    try {
        const response = await api.post("demo");

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
