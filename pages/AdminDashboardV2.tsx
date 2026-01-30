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
    ArrowDownRight,
    Activity,
    PieChart,
    Layers,
    Menu
} from 'lucide-react';
import { db, DashboardStats, Transaction } from '../services/database';
import { usePropertyDetails } from '../contexts/PropertyContext';

const AdminDashboardV2: React.FC = () => {
    const { openPropertyDetailsById } = usePropertyDetails();
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalSales: 0,
        totalRentals: 0,
        activeUsers: 0
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const loadData = () => {
            setStats(db.getStats());
            setTransactions(db.getAllTransactions());
        };

        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-20`}>
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 flex-shrink-0">
                            <Layers className="h-6 w-6 text-white" />
                        </div>
                        {isSidebarOpen && (
                            <div>
                                <h1 className="font-bold text-xl text-slate-800 tracking-tight">JE<span className="text-indigo-600">Admin</span></h1>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <MenuSection title="DASHBOARD" isOpen={isSidebarOpen}>
                        <NavItem icon={<PieChart size={20} />} label="Analytics" active isOpen={isSidebarOpen} />
                        <NavItem icon={<ShoppingBag size={20} />} label="E-commerce" isOpen={isSidebarOpen} />
                        <NavItem icon={<Users size={20} />} label="CRM" isOpen={isSidebarOpen} />
                    </MenuSection>

                    <MenuSection title="GESTÃO" isOpen={isSidebarOpen}>
                        <NavItem icon={<Home size={20} />} label="Propriedades" isOpen={isSidebarOpen} />
                        <NavItem icon={<Calendar size={20} />} label="Agenda" isOpen={isSidebarOpen} />
                        <NavItem icon={<Activity size={20} />} label="Atividades" isOpen={isSidebarOpen} />
                    </MenuSection>

                    <MenuSection title="SISTEMA" isOpen={isSidebarOpen}>
                        <NavItem icon={<Settings size={20} />} label="Ajustes" isOpen={isSidebarOpen} />
                    </MenuSection>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                        </div>
                        <button className="relative p-2.5 bg-white border border-slate-100 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-700">Admin User</p>
                                <p className="text-xs text-slate-400">Super Admin</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">
                                AU
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-[1600px] mx-auto space-y-8">

                        {/* Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <PremiumStatCard
                                title="Receita Total"
                                value={formatCurrency(stats.totalRevenue)}
                                subtext="vs. mês anterior"
                                trend={12.5}
                                icon={<DollarSign className="text-white" />}
                                color="from-emerald-500 to-teal-500"
                            />
                            <PremiumStatCard
                                title="Vendas Ativas"
                                value={stats.totalSales.toString()}
                                subtext="Imóveis vendidos"
                                trend={8.2}
                                icon={<ShoppingBag className="text-white" />}
                                color="from-blue-500 to-indigo-500"
                            />
                            <PremiumStatCard
                                title="Aluguéis"
                                value={stats.totalRentals.toString()}
                                subtext="Contratos vigentes"
                                trend={-2.4}
                                icon={<Home className="text-white" />}
                                color="from-violet-500 to-purple-500"
                            />
                            <PremiumStatCard
                                title="Usuários"
                                value={stats.activeUsers.toString()}
                                subtext="Total cadastrados"
                                trend={24.5}
                                icon={<Users className="text-white" />}
                                color="from-amber-500 to-orange-500"
                            />
                        </div>

                        {/* Charts Area Placeholder & Recent Tx */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Chart Section */}
                            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">Performance de Vendas</h3>
                                        <p className="text-slate-500 text-sm mt-1">Análise comparativa anual</p>
                                    </div>
                                    <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg py-2 px-4 outline-none hover:bg-slate-100 cursor-pointer">
                                        <option>2025</option>
                                        <option>2024</option>
                                    </select>
                                </div>
                                {/* Graphic Placeholder */}
                                <div className="h-[300px] w-full bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-dashed border-indigo-100 flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 flex items-end justify-between px-8 pb-0 opacity-30">
                                        {[40, 70, 45, 90, 65, 85, 50, 75, 60, 95, 80, 100].map((h, i) => (
                                            <div key={i} className="w-8 bg-indigo-600 rounded-t-lg transition-all duration-500 group-hover:h-[80%]!" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <p className="font-medium text-indigo-300 z-10">Gráfico de Performance Interativo</p>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col">
                                <h3 className="font-bold text-xl text-slate-800 mb-6">Atividade Recente</h3>
                                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                                    {transactions.slice(0, 6).map((t, i) => (
                                        <div key={i} className="flex gap-4 items-start group">
                                            <div className={`p-2 rounded-xl mt-1 flex-shrink-0 ${t.type === 'sale' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                                }`}>
                                                {t.type === 'sale' ? <DollarSign size={16} /> : <Home size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                    {t.propertyTitle}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    <span className="font-medium text-slate-700">{t.userName}</span> • {new Date(t.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs font-bold mt-1 text-slate-900">
                                                    {formatCurrency(t.value)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {transactions.length === 0 && (
                                        <div className="text-center py-8 text-slate-400">Sem atividades recentes</div>
                                    )}
                                </div>
                                <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                    Ver Relatório Completo
                                </button>
                            </div>
                        </div>

                        {/* Recent Transactions Table */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">Transações Recentes</h3>
                                    <p className="text-slate-500 text-sm mt-1">Registro completo de operações</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">Filtrar</button>
                                    <button className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Exportar</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">ID / Imóvel</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Valor</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-200 overflow-hidden">
                                                            <img src={t.propertyImage} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div className="ml-4 cursor-pointer group/title" onClick={() => openPropertyDetailsById(t.propertyId)}>
                                                            <div className="text-sm font-bold text-slate-800 group-hover/title:text-indigo-600 transition-colors">{t.propertyTitle}</div>
                                                            <div className="text-xs text-slate-400">#{t.id.slice(0, 6)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-700">{t.userName}</div>
                                                    <div className="text-xs text-slate-400">{t.userEmail}</div>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${t.type === 'sale'
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                        }`}>
                                                        {t.type === 'sale' ? 'Venda Concluída' : 'Aluguel Ativo'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                                                    {formatCurrency(t.value)}
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-slate-400 group-hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-slate-400">Nenhum registro encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

const MenuSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean }> = ({ title, children, isOpen }) => (
    <div className="mb-6">
        {isOpen && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">{title}</div>}
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; isOpen: boolean }> = ({ icon, label, active, isOpen }) => (
    <button
        className={`w-full flex items-center ${isOpen ? 'justify-start' : 'justify-center'} gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
    >
        <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}>{icon}</span>
        {isOpen && <span className="text-sm font-bold">{label}</span>}

        {/* Tooltip for collapsed state */}
        {!isOpen && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {label}
            </div>
        )}
    </button>
);

const PremiumStatCard: React.FC<{
    title: string;
    value: string;
    subtext: string;
    trend: number;
    icon: React.ReactNode;
    color: string;
}> = ({ title, value, subtext, trend, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={`absolute top-0 right-0 p-20 bg-gradient-to-br ${color} opacity-[0.03] rounded-bl-full group-hover:scale-110 transition-transform`}></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-indigo-100`}>
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(trend)}%
            </div>
        </div>

        <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">{title}</p>
            <p className="text-xs text-slate-400 mt-2">{subtext}</p>
        </div>
    </div>
);

export default AdminDashboardV2;
