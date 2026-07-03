import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./login.api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { userSchema } from "../../types/user";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email tidak boleh kosong"),
    password: z.string().min(1, "Password tidak boleh kosong")
});

export function useLoginPresenter() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState(null);
    const setLoginSession = useAuthStore((state) => state.setLoginSession);
    const navigate = useNavigate();

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
            setFormData({ email: '', password: '' });
            setErrorMessage(error.message);
        }
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleLogin(e) {
        e.preventDefault();

        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message || 'Validasi gagal.';
            setErrorMessage(firstError);
            return;
        }

        setErrorMessage(null);
        loginMutation.mutate({ email: formData.email, password: formData.password });
    }

    return {
        formData,
        isLoading: loginMutation.isPending,
        errorMessage,
        handleChange,
        handleLogin
    };
}