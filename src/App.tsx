import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import { Layout } from "./components/Layout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pedidos from "./pages/Pedidos";
import Cozinha from "./pages/Cozinha";
import Colaboradores from "./pages/Colaboradores";
import Produtos from "./pages/Produtos";
import TiposProdutos from "./pages/TiposProdutos";
import Cadastros from "./pages/Cadastros";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/cozinha" element={<Cozinha />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/tipos-produtos" element={<TiposProdutos />} />
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
