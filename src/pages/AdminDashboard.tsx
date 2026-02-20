import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { LayoutDashboard, Users, CalendarDays, CheckCircle, ChevronLeft } from 'lucide-react';

export default function AdminDashboard() {
    const { user, isAdmin } = useAuthStore();
    const navigate = useNavigate();

    const [budgets, setBudgets] = useState<any[]>([]);
    const [profilesMap, setProfilesMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [selectedBudget, setSelectedBudget] = useState<any | null>(null);

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const fetchBudgets = async () => {
            const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                setBudgets(data);
                const userIds = [...new Set(data.map(b => b.user_id))];
                if (userIds.length > 0) {
                    const { data: pData } = await supabase.from('profiles').select('id, full_name, phone').in('id', userIds);
                    if (pData) {
                        const map: Record<string, any> = {};
                        pData.forEach(p => map[p.id] = p);
                        setProfilesMap(map);
                    }
                }
            }
            setLoading(false);
        };

        fetchBudgets();
    }, [user, isAdmin, navigate]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('budgets').update({ status: newStatus }).eq('id', id);
        if (!error) {
            setBudgets(budgets.map(b => b.id === id ? { ...b, status: newStatus } : b));
        }
    };

    const pendingCount = budgets.filter(b => b.status === 'pending').length;
    const confirmedCount = budgets.filter(b => b.status === 'confirmed').length;
    const occupiedDates = budgets.filter(b => b.status === 'confirmed').map(b => new Date(b.date));

    if (loading) return <div className="text-white text-center mt-20">Carregando painel...</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Sidebar / Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-zinc-400 hover:text-white mr-4"><ChevronLeft /></Link>
                        <LayoutDashboard className="text-neon" />
                        <h1 className="text-xl font-bold">Painel de Administração</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Col - Stats & Calendar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Pendentes</p>
                                <p className="text-3xl font-bold">{pendingCount}</p>
                            </div>
                            <CalendarDays className="text-orange-400" size={32} />
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm">Agendados</p>
                                <p className="text-3xl font-bold">{confirmedCount}</p>
                            </div>
                            <CheckCircle className="text-green-400" size={32} />
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <h3 className="font-bold mb-4">Dias Ocupados</h3>
                        <div className="flex justify-center">
                            <DayPicker
                                selected={occupiedDates}
                                locale={ptBR}
                                modifiers={{ booked: occupiedDates }}
                                modifiersStyles={{
                                    booked: { backgroundColor: 'rgba(255, 0, 0, 0.2)', color: 'red' }
                                }}
                                className="text-white scale-90 -mx-4"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Col - Budgets Table */}
                <div className="lg:col-span-3">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Users size={20} /> Solicitações Recentes</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-300">
                                <thead className="bg-zinc-800 text-zinc-400">
                                    <tr>
                                        <th className="p-4">Data / Hora</th>
                                        <th className="p-4">Serviço</th>
                                        <th className="p-4">Cliente</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="border-b border-zinc-800 hover:bg-zinc-800/80 cursor-pointer transition-colors"
                                            onClick={() => setSelectedBudget(b)}
                                        >
                                            <td className="p-4 whitespace-nowrap">
                                                {format(new Date(b.date), 'dd/MM/yyyy', { locale: ptBR })} <br />
                                                <span className="text-neon">{b.time}</span>
                                            </td>
                                            <td className="p-4">{b.service_type}</td>
                                            <td className="p-4 max-w-xs truncate font-medium">{profilesMap[b.user_id]?.full_name || 'Desconhecido'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                                    b.status === 'cancelled' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                                        'bg-orange-900/50 text-orange-400 border border-orange-800'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                {b.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(b.id, 'confirmed'); }}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs transition-colors"
                                                    >
                                                        Confirmar
                                                    </button>
                                                )}
                                                {b.status !== 'cancelled' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(b.id, 'cancelled'); }}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-xs transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {budgets.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-zinc-500">Nenhum agendamento encontrado.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal Overlay */}
            {selectedBudget && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedBudget(null)}
                >
                    <div
                        className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-lg w-full p-6 shadow-xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                            onClick={() => setSelectedBudget(null)}
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-neon border-b border-zinc-800 pb-2">Detalhes do Agendamento</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">Cliente</p>
                                <p className="text-lg font-medium">{profilesMap[selectedBudget.user_id]?.full_name || 'Desconhecido'}</p>
                                {profilesMap[selectedBudget.user_id]?.phone && (
                                    <p className="text-zinc-400 mt-1"><i className="fab fa-whatsapp mr-2"></i>{profilesMap[selectedBudget.user_id].phone}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">Data e Hora</p>
                                    <p className="text-base">{format(new Date(selectedBudget.date), 'dd/MM/yyyy', { locale: ptBR })} às {selectedBudget.time}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">Status</p>
                                    <span className={`px-2 py-1 inline-block mt-1 rounded-full text-xs font-bold uppercase ${selectedBudget.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                        selectedBudget.status === 'cancelled' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                            'bg-orange-900/50 text-orange-400 border border-orange-800'
                                        }`}>
                                        {selectedBudget.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-zinc-800/50 p-4 rounded border border-zinc-800">
                                <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold mb-2"><i className="fas fa-car mr-2"></i>Veículo</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-zinc-500">Marca</p>
                                        <p className="font-medium">{selectedBudget.vehicle_brand || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Modelo</p>
                                        <p className="font-medium">{selectedBudget.vehicle_model || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500">Ano</p>
                                        <p className="font-medium">{selectedBudget.vehicle_year || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">Serviço Solicitado</p>
                                <p className="text-base text-zinc-200">{selectedBudget.service_type}</p>
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">Mensagem / Observações</p>
                                <div className="bg-zinc-800 rounded p-4 mt-2 text-sm text-zinc-300 min-h-[5rem]">
                                    {selectedBudget.message || 'Nenhuma mensagem adicional enviada pelo cliente.'}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
