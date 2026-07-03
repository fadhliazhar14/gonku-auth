import { useState } from "react";
import { loginUser } from "./login.api";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { userSchema } from "../../types/user";

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

        const { email, password } = formData;

        if (!email || !password) {
            setErrorMessage('Email dan password tidak boleh kosong.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const loginResponse = await loginUser(email, password);
            const user = userSchema.safeParse(loginResponse.data);

            if (user.success) {
                setLoginSession(user.data);
            }

            navigate({
                pathname: '/dashboard'
            });
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