-- migrations/002_add_vehicle_details_to_budgets.sql

-- Adiciona as novas colunas de detalhes do veículo à tabela budgets
ALTER TABLE public.budgets
ADD COLUMN IF NOT EXISTS vehicle_brand TEXT,
ADD COLUMN IF NOT EXISTS vehicle_model TEXT,
ADD COLUMN IF NOT EXISTS vehicle_year TEXT;
