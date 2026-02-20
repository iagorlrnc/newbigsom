import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Calendar, Clock, ChevronLeft, LogOut } from 'lucide-react';

export default function Booking() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [vehicleBrand, setVehicleBrand] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleYear, setVehicleYear] = useState('');
    const [service, setService] = useState<string>('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock occupied dates for visual feedback (since DB might be empty initially)
    const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch occupied dates from DB
        const fetchOccupied = async () => {
            const { data } = await supabase.from('budgets').select('date, time').eq('status', 'confirmed');
            // This is a simplified logic, assuming 'budget' table has 'date' column string YYYY-MM-DD
            if (data) {
                const dates = data.map(b => new Date(b.date));
                setOccupiedDates(dates);
            }
        };
        fetchOccupied();

    }, [user, navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime || !service) {
            alert('Por favor, preencha todos os campos obrigatórios (Data, Horário, Serviço).');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('budgets').insert({
                user_id: user?.id,
                vehicle_brand: vehicleBrand,
                vehicle_model: vehicleModel,
                vehicle_year: vehicleYear,
                service_type: service,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedTime,
                message: message,
                status: 'pending' // pending, confirmed, cancelled
            });

            if (error) throw error;

            alert('Orçamento solicitado com sucesso! Nossa equipe entrará em contato.');
            navigate('/');
        } catch (err: any) {
            alert(err.message || 'Erro ao agendar orçamento.');
        } finally {
            setLoading(false);
        }
    };

    const timeSlots = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="text-zinc-400 hover:text-white flex items-center gap-2">
                        <ChevronLeft size={20} /> Voltar ao Início
                    </Link>
                    <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 flex items-center gap-2">
                        Sair <LogOut size={16} />
                    </button>
                </div>

                <div className="bg-zinc-900 shadow rounded-lg px-8 py-10 border border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
                        <h2 className="text-3xl font-bold">Solicitar <span className="text-neon">Orçamento</span></h2>
                        {user?.user_metadata?.full_name && (
                            <p className="text-zinc-400 text-lg">
                                Bem-vindo, <span className="text-white font-medium">{user.user_metadata.full_name}</span>
                            </p>
                        )}
                    </div>
                    <p className="text-zinc-400 mb-8 -mt-6">Escolha a melhor data e horário para trazer seu veículo até nós.</p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column: Date and Time */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-lg font-medium mb-3">
                                    <Calendar className="text-neon" size={20} /> Escolha o Dia
                                </label>
                                <div className="bg-zinc-800 p-4 rounded-lg flex justify-center border border-zinc-700">
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        locale={ptBR}
                                        disabled={[{ dayOfWeek: [0] }]} // Disable sundays
                                        modifiers={{ booked: occupiedDates }}
                                        modifiersStyles={{
                                            booked: { color: 'red', textDecoration: 'line-through' }
                                        }}
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-lg font-medium mb-3">
                                    <Clock className="text-neon" size={20} /> Horários Disponíveis
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 rounded-md text-sm font-medium transition-colors border ${selectedTime === time
                                                ? 'bg-[hsl(190,100%,40%)] border-[hsl(190,100%,40%)] text-white'
                                                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Marca</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-neon"
                                        placeholder="Ex: VW"
                                        value={vehicleBrand}
                                        onChange={(e) => setVehicleBrand(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Modelo</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-neon"
                                        placeholder="Ex: Polo"
                                        value={vehicleModel}
                                        onChange={(e) => setVehicleModel(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Ano do Veículo</label>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon"
                                    placeholder="Ex: 2023"
                                    value={vehicleYear}
                                    onChange={(e) => setVehicleYear(e.target.value)}
                                    maxLength={4}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Serviço Desejado</label>
                                <select
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon"
                                    value={service}
                                    onChange={(e) => setService(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione um serviço</option>
                                    <option value="Instalação de Som">Instalação de Som</option>
                                    <option value="Acessórios e Módulos">Acessórios e Módulos</option>
                                    <option value="Insulfilm">Insulfilm</option>
                                    <option value="Personalização e LED">Personalização e LED</option>
                                    <option value="Outro">Outro (Descreva Abaixo)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-lg font-medium mb-2">Detalhes (Opcional)</label>
                                <textarea
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-neon resize-none h-40"
                                    placeholder="Descreva o que você gostaria de fazer no seu veículo, marca, ano, etc."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-4 text-lg"
                            >
                                {loading ? 'Enviando...' : 'Confirmar Agendamento'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
