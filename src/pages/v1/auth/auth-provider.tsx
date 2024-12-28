// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface AuthContextType {
    isLogin: boolean;
    path: {
        root: string;
        dashboard: string;
    };
}

// Inisialisasi context dengan nilai default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [path, setPath] = useState({
        root: '/v1/auth/sign-in',
        dashboard: '/',
    });

    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token')
        setIsLogin(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, path }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};