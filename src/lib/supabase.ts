import { createClient } from "@supabase/supabase-js";

// Fallbacks para evitar erro de inicialização quando variáveis não estão presentes em dev
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "http://localhost:9999";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "anon-key-placeholder";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  // Aviso amigável para orientar configuração de ambiente
  console.warn(
    "[Supabase] Variáveis de ambiente ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Veja .env.example."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});