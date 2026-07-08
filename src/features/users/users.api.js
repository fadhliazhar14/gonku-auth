import api from "../../libs/axios";

export async function getUsers({ page = 0, size = 10, search = "", searchBy = "" } = {}, signal) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        
        if (search) {
            params.append("search", search);
        }
        if (searchBy) {
            params.append("searchBy", searchBy);
        }

        const response = await api.get(`/users?${params.toString()}`, {
            signal,
        });

        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to get users';
        throw new Error(message, { cause: error });
    }
}

export async function deleteUserById(id) {
    if (!id || id === 0 || id === "0") {
        throw new Error("Trying to delete user with null Id");
    }

    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete user';
        throw new Error(message, { cause: error });
    }
}

export async function reactivateUserById(id) {
    if (!id || id === 0 || id === "0") {
        throw new Error("Trying to reactivate user with null Id");
    }

    try {
        const response = await api.patch(`/users/${id}/reactivate`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to reactivate user';
        throw new Error(message, { cause: error });
    }
}