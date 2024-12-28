// components/RequireAuth.tsx
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './auth-provider';
import SignIn from './sign-in';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const { isLogin, path } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLogin) {
            router.replace(path.root);
        }
    }, [isLogin, router, path.root]);

    if (!isLogin) {
        return <SignIn />
    }

    return <>{children}</>;
};

export default RequireAuth;
