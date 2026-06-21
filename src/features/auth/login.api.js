import { API_BASE_URL } from "../../libs/constants";

export async function loginUser(email, password) {
    const response = await fetch(`${API_BASE_URL.AUTH}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal login, periksa kembali email & password Anda.');
    }

    return response.json();
}