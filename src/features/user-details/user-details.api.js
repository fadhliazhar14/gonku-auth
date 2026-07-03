import api from "../../libs/axios";

export async function saveUser(id, name, username, email) {
    const isNewUser = !id || id === 0 || id === "0";
    const url = isNewUser ? '/users' : `/users/${id}`;
    try {
        const response = isNewUser
            ? await api.post(url, { name, username, email })
            : await api.put(url, { name, username, email });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to save user details';
        throw new Error(message, { cause: error });
    }
}

export async function getUserById(id, signal) {
    try {
        const response = await api.get(`/users/${id}`, { signal });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to get user details';
        throw new Error(message, { cause: error });
    }
}
