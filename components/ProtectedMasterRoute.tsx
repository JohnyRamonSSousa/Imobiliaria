import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/database';

const ProtectedMasterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Verificando autorização...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const permission = db.checkPermission(user.email || '');

    if (permission !== 'MASTER') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
                <p className="text-gray-600 max-w-md">
                    Você não possui permissão para acessar esta área restrita do sistema. Esta tentativa foi registrada.
                </p>
                <button
                    onClick={() => window.location.href = '#/'}
                    className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                    Voltar para Home
                </button>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedMasterRoute;
