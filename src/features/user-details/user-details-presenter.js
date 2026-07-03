import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../libs/routes";
import { getUserById, saveUser } from "./user-details.api";
import { UserDetailsSchema } from "./user-details-model";
import { showToast } from "../../libs/utils/toast";

export const useUserDetailsPresenter = ( id = 0 ) => {
    const initialUserDetails = {
        username: "",
        name: "",
        email: "",
        password: "",
        createdAt: ""
    };
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [userDetails, setUserDetails] = useState(initialUserDetails);
    const navigate = useNavigate();

    useEffect(() => {
        const getUserDetails = async (userId) => {
            try {
                if (userId > 0 || Number(userId) > 0) {
                    const response = await getUserById(userId);
                    const userData = response?.data;

                    if (userData) {
                        setUserDetails(userData);
                    }
                }

                setIsDataFetched(true);
                setErrorMessage(null);
            } catch (error) {
                setIsDataFetched(true);
                setErrorMessage(error.message);
            }
        }
        
        getUserDetails(id);
    }, [id]);

    function handleFormChange(e) {
        const { name, value } = e.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    }

    const handleNavigateToList = useCallback(() => {
        navigate({
            pathname: ROUTES.USERS
        });
    }, [navigate]);

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
        setIsSubmitLoading(true);

        try {
            await saveUser(id, userDetails.name, userDetails.username, userDetails.email);

            setUserDetails(initialUserDetails);
            setIsSubmitLoading(false);
            setErrorMessage(null);
            showToast.success("User details has been saved successfully");
            handleNavigateToList();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitLoading(false);
        }
    }, [id, userDetails, handleNavigateToList]);

    const widgets = Object.keys(userDetails).reduce((acc, fieldName) => {
        acc[fieldName] = {
            value: userDetails[fieldName],
            Valid: !formErrors[fieldName],
            Message: formErrors[fieldName] || "",
        };

        return acc;
    }, {});

    const FormWidget = {
        Valid: Object.values(formErrors).every((msg) => msg === ""),
        Widget: widgets
    };

    return {
        Form: FormWidget,
        isSubmitLoading,
        isDataFetched,
        errorMessage,
        isFormDisabled: isSubmitLoading || !isDataFetched,
        userDetails,
        handleNavigateToList,
        handleFormChange,
        handleSaveUserDetails
    }
}