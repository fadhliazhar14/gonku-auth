import { API_BASE_URL } from "../../libs/constants";
import { fetchWithAuth } from "../../libs/fetchWithAuth";

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

    const url = `${API_BASE_URL.USERS}?${params.toString()}`;
    const response = await fetchWithAuth(url, {
        signal: abortController.current.signal,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    });

    return response.json();
}

export async function deleteUserById(id) {
    if (id === (undefined || null || 0 || "0")) {
        throw new Error("Trying to delete user with null Id");
    }

    const url = `${API_BASE_URL.USERS}/${id}`;
    const response = await fetchWithAuth(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    });

    return response.json();
}