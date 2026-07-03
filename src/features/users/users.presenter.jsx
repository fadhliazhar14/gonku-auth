import { useState, useCallback, useEffect, useRef } from "react";
import { deleteUserById, getUsers } from "./users.api";
import { useNavigate } from "react-router";
import { showToast } from "../../libs/utils/toast";
import { userSchema } from "../../types/user";
import { z } from "zod";

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
    const [isToggle, setIsToggle] = useState(false);
    const navigate = useNavigate();
    const currentUserId = useRef(null);
    const abortControllerRef = useRef(null);
    const [searchVal, setSearchVal] = useState("");
    const [searchByVal, setSearchByVal] = useState("");
    const load = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        
        setState(prev => ({ ...prev, isLoading: true, errorMessage: null }));

        try {
            const data = await getUsers(queryParams, abortControllerRef);
            const usersData = data?.data?.content;

            if (usersData === undefined) {
                throw new Error("Struktur respons API tidak sesuai (Key 'content' tidak ditemukan)");
            }

            const parsedUsers = z.array(userSchema.passthrough()).safeParse(usersData);
            if (!parsedUsers.success) {
                throw new Error("Struktur data daftar user dari server tidak valid.");
            }

            setState({
                users: parsedUsers.data,
                isLoading: false,
                errorMessage: null,
                pagination: {
                    totalPages: data?.data?.totalPages || 0,
                    totalElements: data?.data?.totalElements || 0,
                    pageNumber: data?.data?.page ?? queryParams.page,
                    pageSize: data?.data?.size || 10
                }
            });
        } catch (error) {
            if (error.name !== 'AbortError') {
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
        }
    }, [queryParams]);

    useEffect(() => {
        load();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [queryParams, load]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();

        if (searchByVal.trim().length === 0) {
            return;
        }

        setQueryParams(prev => ({
            ...prev,
            page: 0,
            search: searchVal,
            searchBy: searchByVal
        }));
    });

    const handleSearchByChange = (value) => {
        setSearchByVal(value);
    }

    const handleSearchValChange = (value) => {
        setSearchVal(value);
    }

    const handleDelete = async () => {
        try {
            setState(prev => ({...prev, isLoading: true, errorMessage: null}));
            await deleteUserById(currentUserId.current);

            await load();
            
            setIsToggle(false);
            showToast.success("User has been deactivated successfully");
            setState(prev => ({...prev, isLoading: false, errorMessage: null}));
        } catch (error) {
            setState(prev => ({...prev, isLoading: false, errorMessage: error.message}));
        }
    }

    const handlePageChange = useCallback((newPage) => {
        setQueryParams(prev => ({
            ...prev,
            page: newPage
        }));
    }, []);

    const handleNavigateToDetail = useCallback((userId) => {
        navigate({
            pathname: `/user-details/${userId}`
        });
    }, []);

    const handleToggle = useCallback((userId) => {
        setIsToggle(!isToggle);
        currentUserId.current = userId;
    });

    return {
        ...state,
        queryParams,
        currentUserId,
        isToggle,
        searchVal,
        searchByVal,
        handleSearch,
        handlePageChange,
        handleNavigateToDetail,
        handleDelete,
        handleToggle,
        handleSearchByChange,
        handleSearchValChange
    };
}