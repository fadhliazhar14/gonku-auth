import { useState } from "react";

export default function LoginView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-8">
            <div className="flex-col justify-center align-middle">
                <div className="w-full text-center">
                    <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
                </div>
            
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-md bg-slate-800 border border-slate-700 p-8 rounded-md mt-8">
                        <form>
                           <div>
                                 <label htmlFor="us_email" className="block text-sm/6 font-medium text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input 
                                    type="email"
                                    id="us_email"
                                    onChange={handleEmailChange} 
                                    className="block w-full rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 py-1.5 px-3 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"/>
                                </div>
                           </div>
                           <div className="mt-6">
                                 <label htmlFor="us_password" className="block text-sm/6 font-medium text-white">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input 
                                    type="password" 
                                    id="us_password"
                                    onChange={handlePasswordChange}
                                    className="block w-full rounded-md bg-white/5 outline-1 -outline-offset-1 outline-white/10 py-1.5 px-3 text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none sm:text-sm"/>
                                </div>
                           </div>

                           <div className="mt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                    >
                                    Sign-in
                                </button>
                           </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}