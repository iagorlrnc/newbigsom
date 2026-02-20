import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Register user in Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // Profile row is generally created by Supabase trigger automatically if configured.
                // But just in case, we can manually insert or wait for the trigger.
                // Assuming trigger exists, or we just navigate and let them set up profile.

                alert("Conta criada com sucesso! Você já pode fazer login.");
                navigate('/login');
            }

        } catch (err: any) {
            setError(err.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="absolute top-4 left-4">
                <Link to="/" className="text-zinc-400 hover:text-white flex items-center gap-2">
                    <ChevronLeft size={20} /> Voltar
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Criar nova conta
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Ou{' '}
                    <Link to="/login" className="text-neon hover:text-cyan-400 font-medium cursor-pointer">
                        faça login se já possui cadastro
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-zinc-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-zinc-800">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300">
                                Nome Completo
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-neon focus:border-neon sm:text-sm bg-zinc-800"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-neon focus:border-neon sm:text-sm bg-zinc-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300">
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-neon focus:border-neon sm:text-sm bg-zinc-800"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[hsl(190,100%,40%)] hover:bg-[hsl(190,100%,35%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon focus:ring-offset-zinc-900 disabled:opacity-50"
                            >
                                {loading ? 'Cadastrando...' : 'Criar Conta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
