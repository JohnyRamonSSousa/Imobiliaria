
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contato" className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold text-white tracking-tight">JE<span className="text-indigo-400"> Imobiliária</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefinindo o mercado imobiliário de luxo com transparência, tecnologia e atendimento personalizado em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Serviços & Segmentos</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/imoveis" className="hover:text-indigo-400 transition-colors">Imóveis à Venda</Link></li>
              <li><Link to="/aluguel" className="hover:text-indigo-400 transition-colors">Imóveis para Alugar</Link></li>
              <li><Link to="/servicos" className="hover:text-indigo-400 transition-colors">Administração de Imóveis</Link></li>
              <li><Link to="/servicos" className="hover:text-indigo-400 transition-colors">Avaliação Profissional</Link></li>
              <li><Link to="/servicos" className="hover:text-indigo-400 transition-colors">Vistoria Técnica</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em]">Contato</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-gray-400 leading-tight">Av. Faria Lima, 4500 - 12º Andar<br />Itaim Bibi, São Paulo - SP</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-gray-400">+55 11 4002-8922</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-gray-400">contato@jeimobiliaria.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-widest gap-4">
          <p>© 2026 JE Imobiliária. Todos os direitos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
