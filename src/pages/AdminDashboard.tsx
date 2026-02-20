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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/login');
            return;
        }

        const fetchBudgets = async () => {
            // Ideally we also fetch user data if it's joined, e.g. .select('*, profiles(full_name, email)')
            const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                setBudgets(data);
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
                                        <th className="p-4">Mensagem</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.map((b) => (
                                        <tr key={b.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                            <td className="p-4 whitespace-nowrap">
                                                {format(new Date(b.date), 'dd/MM/yyyy', { locale: ptBR })} <br />
                                                <span className="text-neon">{b.time}</span>
                                            </td>
                                            <td className="p-4">{b.service_type}</td>
                                            <td className="p-4 max-w-xs truncate" title={b.message}>{b.message || '-'}</td>
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
                                                        onClick={() => updateStatus(b.id, 'confirmed')}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs"
                                                    >
                                                        Confirmar
                                                    </button>
                                                )}
                                                {b.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => updateStatus(b.id, 'cancelled')}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-xs"
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
        </div>
    );
}
