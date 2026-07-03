import { useState } from "react";
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
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const setLoginSession = useAuthStore((state) => state.setLoginSession);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleLogin(e) {
        e.preventDefault();

        const validation = loginSchema.safeParse(formData);
        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message || 'Validasi gagal.';
            setErrorMessage(firstError);
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const loginResponse = await loginUser(formData.email, formData.password);
            const user = userSchema.safeParse(loginResponse.data);

            if (user.success) {
                setLoginSession(user.data);
                navigate({
                    pathname: '/dashboard'
                });
            } else {
                setErrorMessage('Struktur data user dari server tidak valid.');
            }
        } catch (error) {
            setFormData({ email: '', password: '' });
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        formData,
        isLoading,
        errorMessage,
        handleChange,
        handleLogin
    };
}