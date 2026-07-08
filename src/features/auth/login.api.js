import api from "../../libs/axios";

export async function loginUser(email, password) {
    try {
        const response = await api.post('/auth/signin', { username: email, password });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed, please check your email and password.';
        throw new Error(message, { cause: error });
    }
}