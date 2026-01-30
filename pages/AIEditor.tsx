import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Wand2, RefreshCw, Download, AlertCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { editImageWithGemini } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

const AIEditor: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = !!user;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await editImageWithGemini(originalImage, 'image/jpeg', prompt);
      if (result) {
        setEditedImage(result);
      } else {
        setError("Não foi possível gerar a edição. Tente um prompt diferente.");
      }
    } catch (err: any) {
      setError("Erro ao processar imagem: " + (err.message || "Tente novamente mais tarde."));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'luxury-state-ai-edit.png';
    link.click();
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          Exclusividade LuxuryState
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
          AI Property Vision
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Visualize o potencial do seu futuro imóvel. Use nossa Inteligência Artificial para adicionar filtros, remover objetos ou re-estilizar fotos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Customização
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Passo 1: Carregar Foto</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center group"
                >
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-indigo-500 mb-2" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                    {originalImage ? "Trocar Imagem" : "Selecionar Foto do Imóvel"}
                  </span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Passo 2: O que deseja mudar?</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: 'Adicione uma piscina no quintal', 'Remova os carros da frente', 'Aplique um filtro retro quente'..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                />
              </div>

              <button
                onClick={handleEdit}
                disabled={!originalImage || !prompt || isLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100"
              >
                {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                <span>{isLoading ? "Processando..." : "Gerar com IA"}</span>
              </button>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-start gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Dicas de Prompts
            </h4>
            <ul className="text-sm space-y-3 text-indigo-100">
              <li className="cursor-pointer hover:text-white" onClick={() => setPrompt("Aplique um estilo cinematográfico com pôr do sol")}>• "Estilo cinematográfico ao pôr do sol"</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setPrompt("Remova todas as pessoas da imagem")}>• "Remova pessoas e objetos distrativos"</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setPrompt("Pinte as paredes externas de cinza chumbo")}>• "Mude a cor da fachada para cinza chumbo"</li>
              <li className="cursor-pointer hover:text-white" onClick={() => setPrompt("Adicione iluminação de luxo no jardim")}>• "Adicione luzes decorativas de jardim"</li>
            </ul>
          </div>
        </div>

        {/* Canvas/Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Resultado</h3>
              {editedImage && (
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 font-bold transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar</span>
                </button>
              )}
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
              {/* Original preview */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Original</p>
                <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-100 flex items-center justify-center relative">
                  {originalImage ? (
                    <img src={originalImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <Upload className="h-10 w-10 mb-2 opacity-20" />
                      <span className="text-xs">Aguardando imagem</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI result preview */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">AI Vision</p>
                <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border-2 border-indigo-100 flex items-center justify-center relative">
                  {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                      <p className="text-indigo-900 font-bold animate-pulse text-sm">Nossa IA está trabalhando...</p>
                    </div>
                  )}
                  {editedImage ? (
                    <img src={editedImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                      <Sparkles className="h-10 w-10 mb-2 opacity-20" />
                      <span className="text-xs">O resultado aparecerá aqui</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEditor;
