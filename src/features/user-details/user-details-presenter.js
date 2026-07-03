import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ROUTES } from "../../libs/routes";
import { getUserById, saveUser } from "./user-details.api";
import { UserDetailsSchema } from "./user-details-model";
import { showToast } from "../../libs/utils/toast";

export const useUserDetailsPresenter = (id = 0) => {
    const initialUserDetails = {
        username: "",
        name: "",
        email: "",
        password: "",
        createdAt: ""
    };

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formState, setFormState] = useState(null);

    const isEditMode = Number(id) > 0;

    const userQuery = useQuery({
        queryKey: ["user", id],
        queryFn: async ({ signal }) => {
            const response = await getUserById(id, signal);
            return response?.data ?? null;
        },
        enabled: isEditMode
    });

    const userDetails = formState ?? userQuery.data ?? initialUserDetails;

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
            setFormState(null);
            setErrorMessage(null);
            showToast.success("User details has been saved successfully");
            handleNavigateToList();
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormState(prev => ({ ...(prev ?? userDetails), [name]: value }));
    }

    const handleSaveUserDetails = useCallback(async (e) => {
        e.preventDefault();

        const result = UserDetailsSchema.safeParse(userDetails);

        if (!result.success) {
            const validationErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0];
                if (fieldName && !validationErrors[fieldName]) {
                    validationErrors[fieldName] = issue.message;
                }
            });
            setFormErrors(validationErrors);
            return;
        }

        setFormErrors({});
        setErrorMessage(null);
        saveMutation.mutate(userDetails);
    }, [userDetails, saveMutation]);

    const widgets = Object.keys(userDetails).reduce((acc, fieldName) => {
        acc[fieldName] = {
            value: userDetails[fieldName] || "",
            Valid: !formErrors[fieldName],
            Message: formErrors[fieldName] || "",
        };

        return acc;
    }, {});

    const FormWidget = {
        Valid: Object.values(formErrors).every((msg) => msg === ""),
        Widget: widgets
    };

    const isDataFetched = isEditMode ? !userQuery.isLoading : true;

    return {
        Form: FormWidget,
        isSubmitLoading: saveMutation.isPending,
        isDataFetched,
        errorMessage: userQuery.error?.message || errorMessage,
        isFormDisabled: saveMutation.isPending || !isDataFetched,
        userDetails,
        handleNavigateToList,
        handleFormChange,
        handleSaveUserDetails
    };
};