import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Settings,
    Bell,
    Search,
    TrendingUp,
    DollarSign,
    Home,
    Calendar,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { db, DashboardStats, Transaction } from '../services/database';
import { usePropertyDetails } from '../contexts/PropertyContext';

const AdminCRM: React.FC = () => {
    const { openPropertyDetailsById } = usePropertyDetails();
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalSales: 0,
        totalRentals: 0,
        activeUsers: 0
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Simulate real-time updates
        const loadData = () => {
            setStats(db.getStats());
            setTransactions(db.getAllTransactions());
        };

        loadData();
        const interval = setInterval(loadData, 5000); // refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">JE Admin</h1>
                        <p className="text-xs text-slate-400">CRM & Vendas</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2 mt-4">Principal</div>
                    <NavItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavItem icon={<ShoppingBag size={20} />} label="Vendas & Aluguéis" active={activeTab === 'sales'} onClick={() => setActiveTab('sales')} />
                    <NavItem icon={<Users size={20} />} label="Clientes" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />

                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2 mt-8">Gerenciamento</div>
                    <NavItem icon={<Home size={20} />} label="Imóveis" />
                    <NavItem icon={<Calendar size={20} />} label="Agendamentos" />
                    <NavItem icon={<Settings size={20} />} label="Configurações" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium">Administrador</p>
                            <p className="text-xs text-slate-400">admin@je.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4 text-gray-400">
                        <Search className="h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar transações, clientes..."
                            className="bg-transparent border-none outline-none text-sm text-gray-700 w-64 placeholder-gray-400"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <button className="text-sm font-bold text-gray-700 hover:text-indigo-600">Suporte</button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">

                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                                <p className="text-gray-500">Bem-vindo ao painel de controle JE.</p>
                            </div>
                            <div className="flex gap-2">
                                <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 outline-none">
                                    <option>Últimos 7 dias</option>
                                    <option>Este Mês</option>
                                    <option>Este Ano</option>
                                </select>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                                    Exportar Relatórios
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Receita Total"
                                value={formatCurrency(stats.totalRevenue)}
                                trend="+12.5%"
                                trendUp={true}
                                icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                                bg="bg-emerald-50"
                            />
                            <StatCard
                                title="Vendas Realizadas"
                                value={stats.totalSales.toString()}
                                trend="+8.2%"
                                trendUp={true}
                                icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
                                bg="bg-blue-50"
                            />
                            <StatCard
                                title="Imóveis Alugados"
                                value={stats.totalRentals.toString()}
                                trend="-2.1%"
                                trendUp={false}
                                icon={<Home className="h-6 w-6 text-purple-600" />}
                                bg="bg-purple-50"
                            />
                            <StatCard
                                title="Usuários Ativos"
                                value={stats.activeUsers.toString()}
                                trend="+24.3%"
                                trendUp={true}
                                icon={<Users className="h-6 w-6 text-amber-600" />}
                                bg="bg-amber-50"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Transactions List */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">Transações Recentes</h3>
                                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Ver Todas</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Imóvel</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                        Nenhuma transação registrada ainda.
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((t) => (
                                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                                    <img src={t.propertyImage} alt="" className="h-full w-full object-cover" />
                                                                </div>
                                                                <div className="ml-4 cursor-pointer group/title" onClick={() => openPropertyDetailsById(t.propertyId)}>
                                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] group-hover/title:text-indigo-600 transition-colors">{t.propertyTitle}</div>
                                                                    <div className="text-xs text-gray-500">ID: {t.propertyId.slice(0, 6)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{t.userName}</div>
                                                            <div className="text-xs text-gray-500">{t.userEmail}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${t.type === 'sale' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                                }`}>
                                                                {t.type === 'sale' ? 'Venda' : 'Aluguel'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                            {formatCurrency(t.value)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                                                                Concluído
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button className="text-gray-400 hover:text-gray-600">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-bold text-gray-900 mb-6">Atividade Recente</h3>
                                <div className="space-y-6">
                                    {transactions.slice(0, 5).map((t, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className={`mt-1 h-2 w-2 rounded-full ${t.type === 'sale' ? 'bg-blue-500' : 'bg-purple-500'} flex-shrink-0`} />
                                            <div>
                                                <p className="text-sm text-gray-800">
                                                    <span className="font-bold">{t.userName}</span> {t.type === 'sale' ? 'comprou' : 'alugou'} <span className="font-bold">{t.propertyTitle}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(t.date).toLocaleString('pt-BR')}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {transactions.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">Aguardando novas atividades...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const StatCard: React.FC<{
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: React.ReactNode;
    bg: string;
}> = ({ title, value, trend, trendUp, icon, bg }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${bg}`}>
                {icon}
            </div>
            <div className={`flex items-center text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-500'} bg-gray-50 px-2 py-1 rounded-full`}>
                {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {trend}
            </div>
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
    </div>
);

export default AdminCRM;
