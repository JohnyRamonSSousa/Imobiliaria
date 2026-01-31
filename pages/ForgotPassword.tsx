import React, { useState } from 'react';
import { Mail, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="bg-green-100 p-5 rounded-full inline-block mb-6">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">E-mail Enviado!</h2>
          <p className="text-gray-600 mb-8">
            Enviamos as instruções para recuperação de sua senha para o e-mail: <br />
            <span className="font-bold text-gray-900">{email}</span>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
            <span className="text-2xl font-serif font-bold text-gray-900">JE<span className="text-indigo-600"> Imobiliária</span></span>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Recuperar Senha</h2>
          <p className="text-gray-500 mt-2">Insira seu e-mail para receber um link de recuperação</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleResetPassword}>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
            >
              {isLoading ? "Enviando..." : "Enviar Instruções"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
