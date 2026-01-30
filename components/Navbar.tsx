import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Comprar', path: '/imoveis' },
    { name: 'Anunciar', path: '/vender' },
    { name: 'Consultores', path: '/#consultores' },
    { name: 'Contato', path: '/#contato' },
  ];

  const handleNavClick = (path: string, name: string) => {
    setIsOpen(false);

    // Proteção para a página de anúncio
    if (name === 'Anunciar' && !isLoggedIn) {
      navigate('/login?reason=sell&redirect=/vender');
      return;
    }

    if (path.startsWith('/#')) {
      const sectionId = path.substring(2);
      if (location.pathname === '/' || location.pathname === '') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-serif font-bold text-gray-900 tracking-tight">JE<span className="text-indigo-600"> Imobiliária</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path, link.name)}
                className={`text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors flex items-center gap-1.5 
                    ${link.name === 'Anunciar' ? 'bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-bold border border-indigo-100 hover:bg-indigo-100' : ''}
                    ${link.name === 'Consultores' ? 'bg-emerald-50 px-4 py-2 rounded-full text-emerald-700 font-bold border border-emerald-100 hover:bg-emerald-100' : ''}`}
              >
                {link.name === 'Anunciar' && <PlusCircle className="h-3.5 w-3.5" />}
                {link.name === 'Consultores' && <User className="h-3.5 w-3.5" />}
                {link.name}
              </button>
            ))}

            <div className="flex items-center space-x-4 border-l border-gray-100 pl-6">
              {!isLoggedIn ? (
                <>
                  <button onClick={() => navigate('/login')} className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium text-sm">
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </button>
                  <button onClick={() => navigate('/cadastro')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                    Cadastre-se
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Minha Conta</span>
                  </button>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sair">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600">
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button key={link.name} className="block w-full text-left px-3 py-4 text-gray-600 hover:bg-gray-50 font-medium border-b border-gray-50 last:border-none" onClick={() => handleNavClick(link.path, link.name)}>
                {link.name}
              </button>
            ))}
            {!isLoggedIn ? (
              <div className="p-3 space-y-2">
                <button onClick={() => navigate('/login')} className="w-full py-3 text-center font-bold text-gray-700 border border-gray-200 rounded-xl">Entrar</button>
                <button onClick={() => navigate('/cadastro')} className="w-full py-3 text-center font-bold text-white bg-indigo-600 rounded-xl">Cadastre-se</button>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                <button
                  onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                  className="w-full py-3 text-center font-bold text-indigo-600 border border-indigo-100 bg-indigo-50 rounded-xl flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Minha Conta
                </button>
                <button onClick={handleLogout} className="w-full py-3 text-center font-bold text-red-600">Sair da Conta</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
