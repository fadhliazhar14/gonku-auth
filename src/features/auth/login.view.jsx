import ButtonLoading from "../../components/utilities/button-loading";
import ErrorMessage from "../../components/utilities/error-message";
import { useLoginPresenter } from "./login.presenter";

export default function LoginView() {
    const {
        register,
        errors,
        isLoading,
        errorMessage,
        handleLogin,
    } = useLoginPresenter();

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-8">
            <div className="flex-col justify-center align-middle">
                <div className="w-full text-center">
                    <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
                </div>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-md bg-slate-800 border border-slate-700 p-8 rounded-md mt-8">
                        <form onSubmit={handleLogin}>
                            <ErrorMessage message={errorMessage} />

                            <div>
                                <label htmlFor="us_email" className="block text-sm/6 font-medium text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        id="us_email"
                                        {...register("email")}
                                        className="block w-full rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 py-1.5 px-3 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm" />
                                </div>
                                {errors?.email && (
                                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="mt-6">
                                <label htmlFor="us_password" className="block text-sm/6 font-medium text-white">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        id="us_password"
                                        {...register("password")}
                                        className="block w-full rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 py-1.5 px-3 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm" />
                                </div>
                                {errors?.password && (
                                    <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="mt-6">
                                <ButtonLoading
                                    onClick={handleLogin}
                                    isLoading={isLoading}
                                    isShowLabelOnLoading={true}
                                    style={"w-full"}>
                                    Sign-in
                                </ButtonLoading>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}