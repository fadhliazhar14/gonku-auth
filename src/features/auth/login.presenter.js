import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "./login.api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../hooks/useAuthStore";
import { userSchema } from "../../schemas/user.schema";
import { loginSchema } from "../../schemas/login.schema";

export function useLoginPresenter() {
    const [errorMessage, setErrorMessage] = useState(null);
    const setLoginSession = useAuthStore((state) => state.setLoginSession);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const loginMutation = useMutation({
        mutationFn: ({ email, password }) => loginUser(email, password),
        onSuccess: (loginResponse) => {
            const rawUser = loginResponse?.data?.userData || loginResponse?.data || loginResponse;
            const user = userSchema.safeParse(rawUser);

            if (user.success) {
                setLoginSession(user.data);
                navigate({
                    pathname: '/dashboard'
                });
            } else {
                setErrorMessage('Invalid user data structure from server.');
            }
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    });

    const handleLogin = handleSubmit((data) => {
        setErrorMessage(null);
        loginMutation.mutate({ email: data.email, password: data.password });
    });

    return {
        register,
        errors,
        isLoading: loginMutation.isPending,
        errorMessage,
        handleLogin
    };
}