import { useState, useCallback, useEffect } from "react";
import { getUsers } from "./users.api";

export function useUsersPresenter() {
    const [usersState, setUsersState] = useState({
        users: null,
        isLoading: true,
        errorMessage: null
    });

    const fetchUsers = useCallback(async () => {
        try {
            const data = await getUsers();
            const usersData = data?.data.content;

            if (usersData === undefined) {
                throw new Error("Struktur respons API tidak sesuai (Key 'content' tidak ditemukan)");
            }

            setUsersState({
                users: usersData,
                isLoading: false,
                errorMessage: null
            });
        } catch (error) {
            setUsersState({
                users: null,
                isLoading: false,
                errorMessage: error.message
            });
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);


    return {
        ...usersState
    };
}