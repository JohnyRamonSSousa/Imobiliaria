import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
                    <AlertCircle className="w-10 h-10 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Página Não Encontrada</h1>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    O imóvel ou a página que você está procurando parece não existir ou foi movida.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Home className="w-5 h-5" />
                    Voltar para Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
