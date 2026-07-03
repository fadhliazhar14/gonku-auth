import api from "../../libs/axios";

export async function getUsers({ page = 0, size = 10, search = "", searchBy = "" } = {}, abortController) {
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
        signal: abortController?.current?.signal,
    });

    return response.data;
}

export async function deleteUserById(id) {
    if (!id || id === 0 || id === "0") {
        throw new Error("Trying to delete user with null Id");
    }

    const response = await api.delete(`/users/${id}`);

    return response.data;
}