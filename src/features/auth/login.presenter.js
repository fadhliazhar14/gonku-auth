import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "./login.api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { userSchema } from "../../types/user-schema";
import { loginSchema } from "./login-schema";

export function useLoginPresenter() {
    const [errorMessage, setErrorMessage] = useState(null);
    const setLoginSession = useAuthStore((state) => state.setLoginSession);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
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
                setErrorMessage('Struktur data user dari server tidak valid.');
            }
        },
        onError: (error) => {
            reset({ email: '', password: '' });
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