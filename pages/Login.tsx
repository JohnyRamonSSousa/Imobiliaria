import React, { useState, useEffect } from 'react';
import { Mail, Lock, AlertCircle, Key, Briefcase } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<React.ReactNode>(<AlertCircle className="h-10 w-10 text-amber-600" />);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect immediately
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/dashboard';
      navigate(redirect);
      return;
    }

    const params = new URLSearchParams(location.search);
    const reason = params.get('reason');

    // Only show modal if NOT logged in (which is implied here since we didn't redirect)
    if (reason === 'buy') {
      setModalMessage('Para prosseguir com a compra deste imóvel, você precisa estar logado em sua conta.');
      setModalIcon(<AlertCircle className="h-10 w-10 text-amber-600" />);
      setShowModal(true);
    } else if (reason === 'sell') {
      setModalMessage('Para anunciar e vender seus imóveis, você precisa estar logado em sua conta.');
      setModalIcon(<AlertCircle className="h-10 w-10 text-amber-600" />);
      setShowModal(true);
    } else if (reason === 'rent') {
      setModalMessage('Nossa seção de aluguel é exclusiva para membros cadastrados. Faça login para acessar as melhores ofertas de locação.');
      setModalIcon(<Key className="h-10 w-10 text-indigo-600" />);
      setShowModal(true);
    } else if (reason === 'services') {
      setModalMessage('Nossa central de serviços é exclusiva para clientes cadastrados. Faça login para gerenciar seus imóveis ou solicitar avaliações e vistorias.');
      setModalIcon(<Briefcase className="h-10 w-10 text-indigo-600" />);
      setShowModal(true);
    }
  }, [location, user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Check Master Access
      if (email === 'master@je.com') {
        navigate('/admin/secure/dashboard');
        return;
      }

      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/dashboard';
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4 relative">
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-4 rounded-full">
                {modalIcon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">Acesso Necessário</h3>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              {modalMessage}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Entendi, fazer login
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
            <span className="text-2xl font-serif font-bold text-gray-900">JE<span className="text-indigo-600"> Imobiliária</span></span>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Bem-vindo de volta</h2>
          <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">Senha</label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
            >
              {isLoading ? "Acessando..." : "Acessar Conta"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="text-indigo-600 font-bold hover:text-indigo-700">Crie agora</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
