import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import burgerHero from "../assets/burger-hero.jpg";
import burgerIcon from "../assets/burger-icon.svg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "../components/ui/card";
import { User, Lock, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompatible, setIsCompatible] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isModernBrowser = "fetch" in window && "localStorage" in window;
    setIsCompatible(isModernBrowser);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast({ title: "Campos obrigatórios", description: "Informe e-mail e senha." });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({ title: "Falha no login", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem("sisgeslan_remember", JSON.stringify(!!rememberMe));
        try {
          const userId = data.user.id;
          const { data: existing } = await supabase
            .from('colaboradores')
            .select('id')
            .eq('auth_user_id', userId)
            .maybeSingle();

          if (!existing) {
            const { error: insertError } = await supabase.from('colaboradores').insert([
              {
                auth_user_id: userId,
                nome_completo: data.user.user_metadata?.full_name || data.user.email || 'Usuário',
                email: data.user.email || '',
                cargo: 'Funcionário',
              },
            ]);

            if (insertError) {
              throw insertError; // Lança o erro para ser pego pelo catch principal
            }
          }
        } catch (e: any) {
          console.error('[Login] Falha ao garantir colaborador:', e);
          toast({
            title: "Erro Crítico de Perfil",
            description: `Seu perfil de colaborador não pôde ser criado: ${e.message}. Contate o suporte. `,
            variant: "destructive",
            duration: 9000,
          });
        }

        toast({ title: "Login realizado", description: "Bem-vindo de volta!" });
        navigate("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ocorreu um erro inesperado. Tente novamente.";
      toast({ title: "Erro inesperado", description: message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {!isCompatible && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
          Seu navegador pode não ser totalmente compatível com este sistema. Recomendamos usar Chrome, Firefox ou Edge atualizados.
        </div>
      )}

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${burgerHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)",
        }}
      />

      <div className="z-10 w-full max-w-sm">
        <Card className="w-full bg-white/20 backdrop-blur-sm border border-white/50 shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-col items-center text-center">
            <img src={burgerIcon} alt="Logo" className="w-20 h-20 sm:w-24 sm:h-24 mb-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">SISTEMA DE GESTÃO DE LANCHONETE</h1>
            <CardDescription className="text-white/90 mt-2 px-4">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <User size={18} className="text-white" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/50 focus:border-white text-white placeholder:text-white/70 w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock size={18} className="text-white" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/50 focus:border-white text-white placeholder:text-white/70 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <Label htmlFor="remember" className="text-white/90">
                  Lembrar de mim
                </Label>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 flex items-center justify-center gap-2 rounded-lg"
              >
                <LogIn size={18} />
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              <div className="flex flex-col sm:flex-row items-center justify-between text-white/90 text-sm gap-2 sm:gap-0 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="underline hover:text-white"
                >
                  Esqueceu sua senha?
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="underline hover:text-white"
                >
                  Criar conta
                </button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-1 pt-4">
            <p className="text-sm text-white/80">
               {new Date().getFullYear()} © SisgesLan
            </p>
            <p className="text-xs text-white/60">Desenvolvido por Ctor4.com</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
