import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { auth, googleProvider } from "../firebase/config";
import { createUserIfNotExists } from "../firestore/userService";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setisAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setisAuth(currentUser ? true : false);
            setLoading(false);
        });

        return () => unsub();
    }, []);


    async function login() {
        const result= await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        await createUserIfNotExists(firebaseUser);

        setUser(firebaseUser);
        setisAuth(true);
    }

    async function logout() {
        if (confirm("Are you sure? Want to logout ?")) {
            await signOut(auth);
            setUser(null);
            setisAuth(false);
        }
    }

    
    return (
        <AuthContext.Provider value={{ user, isAuth, login, logout, loading }}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    );
}

export const AuthData = () => useContext(AuthContext);