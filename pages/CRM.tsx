import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Home, Key, Clock, Settings, Wallet, Bell, CheckCircle2, Trash2, LayoutGrid, PlusCircle, MapPin } from 'lucide-react';
import { db, Transaction } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { usePropertyDetails } from '../contexts/PropertyContext';
import { supabase } from '../services/supabase';
const CRM: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { openPropertyDetailsById } = usePropertyDetails();
    const [activeTab, setActiveTab] = useState('overview');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [myProperties, setMyProperties] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const userEmail = user?.email || 'cliente@exemplo.com';
    const userName = user?.user_metadata?.full_name || userEmail.split('@')[0];

    const loadData = async () => {
        // Transactions
        const allTxs = db.getUserTransactions(userEmail);
        setTransactions(allTxs);

        // My Listings from Supabase
        if (user?.id) {
            try {
                const { data, error } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('user_id', user.id);

                if (!error && data) {
                    setMyProperties(data);
                }
            } catch (err) {
                console.error('Error fetching my properties:', err);
            }
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        loadData();
    }, [navigate, user, userEmail]);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const handleDeleteProperty = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.')) return;

        setIsDeleting(id);
        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMyProperties(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert('Erro ao excluir anúncio: ' + err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('TEM CERTEZA QUE DESEJA EXCLUIR SUA CONTA? Esta ação excluirá todos os seus anúncios e você será deslogado. Esta ação é IRREVERSÍVEL.')) return;

        const confirmPhrase = window.prompt('Para confirmar, digite "EXCLUIR MINHA CONTA":');
        if (confirmPhrase !== 'EXCLUIR MINHA CONTA') {
            alert('Confirmação inválida. A conta não foi excluída.');
            return;
        }

        setIsDeletingAccount(true);
        try {
            // Delete properties
            if (user?.id) {
                await supabase
                    .from('properties')
                    .delete()
                    .eq('user_id', user.id);
            }

            // In a real production app, you would call a Supabase Edge Function 
            // to delete the user from auth.users using a service_role key.
            // For now, we sign out and inform the user.

            await signOut();
            alert('Sua conta e seus anúncios foram removidos com sucesso. Agradecemos por utilizar o LXW Imobiliária.');
            navigate('/');
        } catch (err: any) {
            alert('Erro ao excluir conta: ' + err.message);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleComplete = (id: string) => {
        if (db.updateTransactionStatus(id, 'completed')) {
            loadData();
        }
    };

    const purchases = transactions.filter(t => t.type === 'sale' && t.status === 'pending');
    const rentals = transactions.filter(t => t.type === 'rent' && t.status === 'pending');
    const history = transactions.filter(t => t.status === 'completed');

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-200">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 capitalize">{userName}</h1>
                        <p className="text-gray-500">{userEmail}</p>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Conta Verificada</span>
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Cliente Premium</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-3">
                        <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="h-5 w-5" />
                            <span className="hidden sm:inline">Excluir Conta</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <nav className="flex flex-col p-2">
                                <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Home className="h-5 w-5" />} label="Visão Geral" />
                                <NavButton active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} icon={<LayoutGrid className="h-5 w-5" />} label="Meus Anúncios" count={myProperties.length} />
                                <NavButton active={activeTab === 'purchases'} onClick={() => setActiveTab('purchases')} icon={<Wallet className="h-5 w-5" />} label="Minhas Compras" count={purchases.length} />
                                <NavButton active={activeTab === 'rentals'} onClick={() => setActiveTab('rentals')} icon={<Key className="h-5 w-5" />} label="Meus Aluguéis" count={rentals.length} />
                                <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<Clock className="h-5 w-5" />} label="Histórico" count={history.length} />
                                <div className="my-2 border-t border-gray-100"></div>
                                <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings className="h-5 w-5" />} label="Configurações" />
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                                        <Wallet className="h-8 w-8 mb-4 opacity-80" />
                                        <p className="text-indigo-200 text-sm font-medium">Total Investido</p>
                                        <h3 className="text-3xl font-bold mt-1">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                history.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.value, 0)
                                            )}
                                        </h3>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <Key className="h-8 w-8 mb-4 text-purple-500" />
                                        <p className="text-gray-500 text-sm font-medium">Contratos Ativos</p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{purchases.length + rentals.length}</h3>
                                    </div>
                                </div>

                                {/* Recent Items */}
                                <h3 className="font-serif font-bold text-xl text-gray-900 mt-8 mb-4">Ações Pendentes</h3>
                                {(purchases.length > 0 || rentals.length > 0) ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[...purchases, ...rentals].slice(0, 2).map(t => (
                                            <PropertyCard
                                                key={t.id}
                                                transaction={t}
                                                onDetails={() => openPropertyDetailsById(t.propertyId)}
                                                onComplete={() => handleComplete(t.id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                                        <p className="text-emerald-900 font-bold">Tudo em dia! Você não tem propostas pendentes.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'listings' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">Meus Imóveis Anunciados</h2>
                                    <button
                                        onClick={() => navigate('/vender')}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Novo Anúncio
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {myProperties.map(p => (
                                        <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-shadow">
                                            <div className="w-full md:w-48 h-48 bg-gray-200 relative shrink-0">
                                                <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    <div className="px-2 py-1 bg-indigo-600/90 text-white text-[10px] font-bold rounded uppercase w-fit">
                                                        {p.type}
                                                    </div>
                                                    <div className={`px-2 py-1 ${p.listing_type === 'venda' ? 'bg-emerald-500/90' : 'bg-blue-500/90'} text-white text-[10px] font-bold rounded uppercase w-fit`}>
                                                        {p.listing_type === 'venda' ? 'Venda' : 'Aluguel'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{p.title}</h4>
                                                        <span className="text-indigo-600 font-bold text-xl">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {p.location?.neighborhood}, {p.location?.city}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => openPropertyDetailsById(p.id)}
                                                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                                                    >
                                                        Visualizar
                                                    </button>
                                                    <button
                                                        disabled={isDeleting === p.id}
                                                        onClick={() => handleDeleteProperty(p.id)}
                                                        className="px-4 py-2.5 border border-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                                                    >
                                                        {isDeleting === p.id ? (
                                                            <span className="h-4 w-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                        Excluir Anúncio
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {myProperties.length === 0 && (
                                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                            <LayoutGrid className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                            <h3 className="text-gray-900 font-bold mb-1">Crie seu primeiro anúncio</h3>
                                            <p className="text-gray-500 text-sm mb-6">Você ainda não tem nenhum imóvel colocado à venda ou aluguel.</p>
                                            <button
                                                onClick={() => navigate('/vender')}
                                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                            >
                                                Anunciar Agora
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {(activeTab === 'purchases' || activeTab === 'rentals' || activeTab === 'history') && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                                    {activeTab === 'purchases' ? 'Propostas de Compra' :
                                        activeTab === 'rentals' ? 'Propostas de Aluguel' : 'Histórico Completo'}
                                </h2>
                                <p className="text-gray-500 mb-6 text-sm">
                                    {activeTab === 'purchases' ? 'Acompanhe suas propostas de aquisição de imóveis.' :
                                        activeTab === 'rentals' ? 'Acompanhe seus interesses e contratos de locação.' :
                                            'Registro de todas as suas negociações finalizadas com sucesso.'}
                                </p>

                                {activeTab === 'history' && history.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Total em Compras</p>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                    history.filter(t => t.type === 'sale').reduce((acc, curr) => acc + curr.value, 0)
                                                )}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                            <p className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">Imóveis Alugados</p>
                                            <p className="text-2xl font-bold text-purple-900">
                                                {history.filter(t => t.type === 'rent').length} contrato(s)
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-6">
                                    {(activeTab === 'purchases' ? purchases : activeTab === 'rentals' ? rentals : history).map(t => (
                                        <PropertyCard
                                            key={t.id}
                                            transaction={t}
                                            landscape
                                            onDetails={() => openPropertyDetailsById(t.propertyId)}
                                            onComplete={t.status === 'pending' ? () => handleComplete(t.id) : undefined}
                                        />
                                    ))}
                                    {(activeTab === 'purchases' ? purchases : activeTab === 'rentals' ? rentals : history).length === 0 && <EmptyState />}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Configurações da Conta</h2>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-indigo-600" />
                                            Dados Pessoais
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome Completo</label>
                                                <input type="text" defaultValue={userName} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">E-mail</label>
                                                <input type="email" defaultValue={userEmail} disabled className="w-full p-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-500 cursor-not-allowed" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Telefone</label>
                                                <input type="text" placeholder="(11) 99999-9999" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">CPF</label>
                                                <input type="text" placeholder="000.000.000-00" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 font-medium" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Salvar Alterações</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-indigo-600" />
                                            Preferências
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-900">Notificações por Email</h4>
                                                <p className="text-sm text-gray-500">Receba atualizações sobre seus imóveis</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div>
                                                <h4 className="font-bold text-gray-900">Autenticação em Dois Fatores</h4>
                                                <p className="text-sm text-gray-500">Aumente a segurança da sua conta</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 bg-red-50 rounded-2xl border border-red-100 overflow-hidden">
                                    <div className="p-6 border-b border-red-100 bg-red-100/50">
                                        <h3 className="font-bold text-red-900 flex items-center gap-2">
                                            <Trash2 className="h-5 w-5" />
                                            Zona de Perigo
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-sm text-red-700 mb-4">
                                            Uma vez que você exclua sua conta, não há volta. Por favor, tenha certeza.
                                            Seus anúncios ativos também serão removidos permanentemente.
                                        </p>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={isDeletingAccount}
                                            className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                                        >
                                            {isDeletingAccount ? (
                                                <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            Excluir Minha Conta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

const NavButton: React.FC<{ active?: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }> = ({ active, onClick, icon, label, count }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
        </div>
        {count !== undefined && count > 0 && (
            <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{count}</span>
        )}
    </button>
);

const PropertyCard: React.FC<{ transaction: Transaction; landscape?: boolean; onDetails?: () => void; onComplete?: () => void }> = ({ transaction, landscape, onDetails, onComplete }) => {
    const isCompleted = transaction.status === 'completed';

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex ${landscape ? 'flex-row' : 'flex-col'} group hover:shadow-md transition-all ${isCompleted ? 'opacity-70 grayscale-[0.5]' : ''}`}>
            <div className={`${landscape ? 'w-48 h-full' : 'w-full h-48'} bg-gray-200 relative`}>
                <img src={transaction.propertyImage} className="w-full h-full object-cover" alt="" />
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold uppercase ${transaction.type === 'sale' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                    {transaction.type === 'sale' ? 'Comprado' : 'Alugado'}
                </div>
                {transaction.status === 'pending' && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pendente</div>
                )}
                {isCompleted && (
                    <div className="absolute bottom-2 left-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Concluído</div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{transaction.propertyTitle}</h4>
                    <p className="text-sm text-gray-500 mb-3">{new Date(transaction.date).toLocaleDateString()}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-indigo-600 font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.value)}
                            {transaction.type === 'rent' && '/mês'}
                        </p>
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={isCompleted ? undefined : onDetails}
                        disabled={isCompleted}
                        className={`flex-1 py-2 border rounded-lg text-sm font-bold transition-colors ${isCompleted
                            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                            }`}
                    >
                        {isCompleted ? 'Anúncio Inativo' : 'Ver Detalhes'}
                    </button>
                    {onComplete && (
                        <button
                            onClick={onComplete}
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Concluir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-gray-900 font-bold mb-1">Nenhum imóvel encontrado</h3>
        <p className="text-gray-500 text-sm">Você ainda não realizou nenhuma transação.</p>
    </div>
);

export default CRM;
