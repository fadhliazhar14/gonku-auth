import { useState, useCallback, useEffect } from "react";
import { getUsers } from "./users.api";

export function useUsersPresenter() {
    const [state, setState] = useState({
        users: null,
        isLoading: true,
        errorMessage: null,
        pagination: {
            totalPages: 0,
            totalElements: 0,
            pageNumber: 0,
            pageSize: 10
        }
    });

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        search: "",
        searchBy: ""
    });

    useEffect(() => {
        let active = true;

        const load = async () => {
            await Promise.resolve();
            if (!active) return;
            setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

            try {
                const data = await getUsers(queryParams);
                if (!active) return;
                const usersData = data?.data?.content;

                if (usersData === undefined) {
                    throw new Error("Struktur respons API tidak sesuai (Key 'content' tidak ditemukan)");
                }

                setState({
                    users: usersData,
                    isLoading: false,
                    errorMessage: null,
                    pagination: {
                        totalPages: data?.data?.totalPages || 0,
                        totalElements: data?.data?.totalElements || 0,
                        pageNumber: data?.data?.number || 0,
                        pageSize: data?.data?.size || 10
                    }
                });
            } catch (error) {
                if (!active) return;
                setState({
                    users: null,
                    isLoading: false,
                    errorMessage: error.message,
                    pagination: {
                        totalPages: 0,
                        totalElements: 0,
                        pageNumber: 0,
                        pageSize: 10
                    }
                });
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [queryParams]);

    const handleSearch = useCallback((search, searchBy) => {
        setQueryParams(prev => ({
            ...prev,
            page: 0,
            search,
            searchBy
        }));
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setQueryParams(prev => ({
            ...prev,
            page: newPage
        }));
    }, []);

    return {
        ...state,
        queryParams,
        handleSearch,
        handlePageChange
    };
}