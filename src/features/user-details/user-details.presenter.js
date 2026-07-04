import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "../../constants/routes";
import { getUserById, saveUser } from "./user-details.api";
import { UserDetailsSchema } from "./user-details-schema";
import { showToast } from "../../libs/utils/toast";

export const useUserDetailsPresenter = (id = 0) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const isEditMode = Number(id) > 0;

    const userQuery = useQuery({
        queryKey: ["user", id],
        queryFn: async ({ signal }) => {
            const response = await getUserById(id, signal);
            return response?.data ?? null;
        },
        enabled: isEditMode
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(UserDetailsSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            createdAt: ""
        },
        values: {
            username: userQuery.data?.username || "",
            name: userQuery.data?.name || "",
            email: userQuery.data?.email || "",
            createdAt: userQuery.data?.createdAt || ""
        }
    });


    const handleNavigateToList = useCallback(() => {
        navigate({
            pathname: ROUTES.USERS
        });
    }, [navigate]);

    const saveMutation = useMutation({
        mutationFn: (dataToSave) => saveUser(id, dataToSave.name, dataToSave.username, dataToSave.email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ["user", id] });
            }
            setErrorMessage(null);
            showToast.success("User details has been saved successfully");
            handleNavigateToList();
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const handleSaveUserDetails = handleSubmit((data) => {
        setErrorMessage(null);
        saveMutation.mutate(data);
    });

    const isDataFetched = isEditMode ? !userQuery.isLoading : true;

    return {
        register,
        errors,
        isDirty,
        isSubmitLoading: saveMutation.isPending,
        isDataFetched,
        errorMessage: userQuery.error?.message || errorMessage,
        isFormDisabled: saveMutation.isPending || !isDataFetched,
        userDetails: userQuery.data || {},
        handleNavigateToList,
        handleSaveUserDetails
    };
};