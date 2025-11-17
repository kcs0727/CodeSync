import React from "react";
import { AuthData } from "../context/Authcontext";


const Login = () => {

    const {login}= AuthData();

    const googleLogin = async () => {
        await login();
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <button onClick={googleLogin} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-bold text-2xl">
                Login with Google
            </button>
        </div>
    );
};

export default Login;
