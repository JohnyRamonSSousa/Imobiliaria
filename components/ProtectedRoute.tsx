import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    reason?: 'buy' | 'rent' | 'services' | 'sell';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, reason }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Verificando acesso...</p>
            </div>
        );
    }

    if (!user) {
        const searchParams = new URLSearchParams();
        if (reason) searchParams.set('reason', reason);
        searchParams.set('redirect', location.pathname);

        return <Navigate to={`/login?${searchParams.toString()}`} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
