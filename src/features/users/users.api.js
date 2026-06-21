import { API_BASE_URL } from "../../libs/constants";
import { fetchWithAuth } from "../../libs/fetchWithAuth";

export async function getUsers() {
    const response = await fetchWithAuth(API_BASE_URL.USERS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
    });

    return response.json();
}