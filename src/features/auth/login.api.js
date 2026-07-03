import api from "../../libs/axios";

export async function loginUser(email, password) {
    try {
        const response = await api.post('/auth/signin', { username: email, password });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Gagal login, periksa kembali email & password Anda.';
        throw new Error(message, { cause: error });
    }
}