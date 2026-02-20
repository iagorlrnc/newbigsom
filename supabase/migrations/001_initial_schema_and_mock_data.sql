-- migrations/001_initial_schema_and_mock_data.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.budgets;
DROP TABLE IF EXISTS public.profiles;

-- Tabela de Perfis
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas super simples para profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger de Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabela de Budgets
CREATE TABLE public.budgets (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAUlT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- POLITICAS RLS SIMPLIFICADAS PARA NÃO TRAVAR O CACHE DE SCHEMA
-- Permitir que qualquer usuário autenticado leia todos os budgets (necessário para bloquear os dias no calendário)
CREATE POLICY "Authenticated users can select budgets" ON public.budgets FOR SELECT USING (auth.role() = 'authenticated');
-- Permitir que qualquer usuário autenticado crie budgets no SEU nome
CREATE POLICY "Users can insert their own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Permitir que qualquer usuário autenticado edite QUALQUER budget (simplificado apenas para o MVP não bugar no cache, em produção o ideal é usar JWT Claims ou Funções Security Definer)
CREATE POLICY "Authenticated users can update budgets" ON public.budgets FOR UPDATE USING (auth.role() = 'authenticated');


DO $$
DECLARE
    admin_id UUID := '00000000-0000-0000-0000-000000000001';
    client_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
    DELETE FROM auth.users WHERE id IN (admin_id, client_id);

    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role) 
    VALUES (
        admin_id, '00000000-0000-0000-0000-000000000000', 'admin@bigsom.com.br', crypt('admin123', gen_salt('bf')), now(), '{"full_name":"Administrador Root", "phone":"63999990000"}', now(), now(), 'authenticated', 'authenticated'
    );
    
    -- O Trigger rodou, vamos promover a Admin
    UPDATE public.profiles SET is_admin = true WHERE id = admin_id;

    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
    VALUES (
        client_id, '00000000-0000-0000-0000-000000000000', 'cliente@email.com', crypt('cliente123', gen_salt('bf')), now(), '{"full_name":"João Cliente", "phone":"63988880000"}', now(), now(), 'authenticated', 'authenticated'
    );

    INSERT INTO public.budgets (user_id, service_type, date, time, message, status) VALUES 
    (client_id, 'Instalação de Som', to_char(now() + interval '2 days', 'YYYY-MM-DD'), '09:00', 'Quero montar um som pancadão no Celta 2011.', 'pending'),
    (client_id, 'Insulfilm', to_char(now() + interval '4 days', 'YYYY-MM-DD'), '14:00', 'Película G20 nas laterais, G35 no parabrisa. Hilux.', 'confirmed'),
    (client_id, 'Personalização e LED', to_char(now() + interval '5 days', 'YYYY-MM-DD'), '16:00', 'Quero colocar fita de led no interior do painel.', 'pending'),
    (client_id, 'Acessórios e Módulos', to_char(now() + interval '10 days', 'YYYY-MM-DD'), '08:00', 'Trocar meu módulo atual por um Taramps de 3000w.', 'cancelled'),
    (client_id, 'Instalação de Som', to_char(now() + interval '15 days', 'YYYY-MM-DD'), '10:00', 'Qual o valor pra instalar uma multimídia que já comprei no civic?', 'pending');
END $$;
