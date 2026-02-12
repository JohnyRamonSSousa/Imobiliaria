import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}) => {
    if (!isOpen) return null;

    console.log('DeleteAccountModal rendering, isOpen:', isOpen);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                    <div className="bg-red-100 p-4 rounded-full mb-4 shadow-inner">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Tem certeza absoluta?</h2>
                    <p className="text-red-700 font-medium mt-2">Esta ação é extremamente destrutiva.</p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                        <p>
                            Ao excluir sua conta, você perderá acesso imediato ao painel e a todos os recursos da plataforma.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-red-600 font-medium">
                            <li>Todos os seus anúncios serão removidos permanentemente.</li>
                            <li>Seu histórico de transações será apagado.</li>
                            <li>Sua conta não poderá ser recuperada.</li>
                        </ul>
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Excluindo...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    <span>Excluir Tudo</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
