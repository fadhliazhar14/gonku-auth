import { API_BASE_URL } from "../../libs/constants";
import { fetchWithAuth } from "../../libs/fetchWithAuth";

export async function saveUser(id, name, username, email) {
    const isNewUser = !id || id === 0 || id === "0"; 
    const url = isNewUser ? API_BASE_URL.USERS : `${API_BASE_URL.USERS}/${id}`
    const response = await fetchWithAuth(url, {
        method: isNewUser ? 'POST' : 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email}),
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save user details');
    }

    return response.json();
}

export async function getUserById(id) {
    const response = await fetchWithAuth(`${API_BASE_URL.USERS}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get user details');
    }

    return response.json();
}