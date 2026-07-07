import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserById, reactivateUserById, getUsers } from "./users.api";
import { useNavigate } from "react-router";
import { showToast } from "../../utils/toast";
import { userSchema } from "../../schemas/user.schema";
import { z } from "zod";

export function useUsersPresenter() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [queryParams, setQueryParams] = useState({
        page: 0,
        size: 10,
        search: "",
        searchBy: ""
    });
    const [isToggle, setIsToggle] = useState(false);
    const currentUserId = useRef(null);
    const currentAction = useRef(null); // "deactivate" | "reactivate"
    const [searchVal, setSearchVal] = useState("");
    const [searchByVal, setSearchByVal] = useState("");

    const usersQuery = useQuery({
        queryKey: ["users", queryParams],
        queryFn: async ({ signal }) => {
            const data = await getUsers(queryParams, signal);
            const usersData = data?.data?.content;

            if (usersData === undefined) {
                throw new Error("Struktur respons API tidak sesuai (Key 'content' tidak ditemukan)");
            }

            const parsedUsers = z.array(userSchema.passthrough()).safeParse(usersData);
            if (!parsedUsers.success) {
                throw new Error("Struktur data daftar user dari server tidak valid.");
            }

            return {
                users: parsedUsers.data,
                pagination: {
                    totalPages: data?.data?.totalPages || 0,
                    totalElements: data?.data?.totalElements || 0,
                    pageNumber: data?.data?.page ?? queryParams.page,
                    pageSize: data?.data?.size || 10
                }
            };
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (userId) => deleteUserById(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsToggle(false);
            showToast.success("User has been deactivated successfully");
        }
    });

    const reactivateMutation = useMutation({
        mutationFn: (userId) => reactivateUserById(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsToggle(false);
            showToast.success("User has been reactivated successfully");
        }
    });

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
    }, [searchVal, searchByVal]);

    const handleSearchByChange = (value) => {
        setSearchByVal(value);
    };

    const handleSearchValChange = (value) => {
        setSearchVal(value);
    };

    const handleDelete = useCallback(() => {
        if (currentAction.current === "reactivate") {
            reactivateMutation.mutate(currentUserId.current);
        } else {
            deleteMutation.mutate(currentUserId.current);
        }
    }, [deleteMutation, reactivateMutation]);

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
    }, [navigate]);

    const handleToggle = useCallback((userId, action = "deactivate") => {
        setIsToggle(prev => !prev);
        currentUserId.current = userId;
        currentAction.current = action;
    }, []);

    return {
        users: usersQuery.data?.users ?? null,
        isLoading: usersQuery.isLoading || deleteMutation.isPending || reactivateMutation.isPending,
        errorMessage: usersQuery.error?.message || deleteMutation.error?.message || reactivateMutation.error?.message || null,
        pagination: usersQuery.data?.pagination ?? {
            totalPages: 0,
            totalElements: 0,
            pageNumber: 0,
            pageSize: 10
        },
        queryParams,
        currentUserId,
        currentAction,
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