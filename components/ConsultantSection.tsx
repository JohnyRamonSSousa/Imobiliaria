
import React from 'react';
import { MessageCircle, Award, Star } from 'lucide-react';
import { CONSULTANTS } from '../constants';

const ConsultantSection: React.FC = () => {
  return (
    <section id="consultores" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          Nossa Equipe
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Fale com um Consultor Especialista
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16 text-lg">
          Profissionais altamente qualificados para guiar você em cada etapa do seu próximo investimento imobiliário.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CONSULTANTS.map((consultant) => (
            <div key={consultant.id} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-indigo-600 rounded-full scale-110 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <img 
                  src={consultant.photo} 
                  alt={consultant.name} 
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full border-2 border-white">
                  <Star className="h-3 w-3 text-white fill-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{consultant.name}</h3>
              <p className="text-indigo-600 font-semibold text-sm mb-4 uppercase tracking-wider">{consultant.role}</p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-8 bg-gray-50 py-2 rounded-xl">
                <Award className="h-4 w-4 text-indigo-400" />
                <span>Atuação: {consultant.region}</span>
              </div>

              <button 
                onClick={() => window.open(`https://wa.me/${consultant.phone}`, '_blank')}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Conversar no WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultantSection;
