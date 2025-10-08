import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

// Layout
import { Layout } from "./components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Pedidos from "./pages/Pedidos";
import Cozinha from "./pages/Cozinha";
import Colaboradores from "./pages/Colaboradores";
import Produtos from "./pages/Produtos";
import TiposProdutos from "./pages/TiposProdutos";
import Cadastros from "./pages/Cadastros";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthenticated(!!data.session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAuthenticated(!!session);
    });
    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6">Carregando…</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<Pedidos />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="cozinha" element={<Cozinha />} />
            <Route path="colaboradores" element={<Colaboradores />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="tipos-produtos" element={<TiposProdutos />} />
            <Route path="cadastros" element={<Cadastros />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
