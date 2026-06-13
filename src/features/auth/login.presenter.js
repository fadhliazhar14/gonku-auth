// src/features/auth/login.presenter.js
import { useState } from "react";
import { loginUser } from "./login.api";
import { useNavigate } from "react-router";

export function useLoginPresenter() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage('Email dan password tidak boleh kosong.');
            
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            await loginUser(email, password);

            navigate({
                pathname: '/dashboard'
            });
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        email,
        password,
        isLoading,
        errorMessage,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit
    };
}