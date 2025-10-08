import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import burgerHero from '../assets/burger-hero.jpg';
import burgerIcon from '../assets/burger-icon.svg';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '../components/ui/card';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

export default function Signup() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto || !email || !password || !confirmPassword) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos.' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Senha fraca', description: 'A senha deve ter ao menos 6 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Senhas diferentes', description: 'A confirmação deve ser igual à senha.' });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nomeCompleto,
          },
        },
      });

      if (error) {
        toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
        return;
      }

      // Se o cadastro foi bem-sucedido, o usuário é criado.
      // A lógica de criação do registro 'colaborador' associado já está no Login.tsx,
      // que é mais robusto. Então, apenas redirecionamos para o login.
      if (data.user) {
        toast({ title: "Conta criada com sucesso!", description: "Agora você já pode fazer o login." });
        navigate("/login");
      } else {
        // Caso pouco provável se não houve erro, mas é bom tratar.
        toast({
          title: "Erro inesperado",
          description: "Não foi possível criar a conta. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({ title: 'Erro inesperado', description: err?.message || 'Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${burgerHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }}
      />
      <div className="z-10 w-full max-w-md px-4 sm:px-6 md:px-8">
        <Card className="w-full bg-white/30 backdrop-blur-sm border-2 border-white/70 shadow-xl">
          <CardHeader className="flex flex-col items-center">
            <img src={burgerIcon} alt="Logo" className="w-20 h-20 mb-2" />
            <h1 className="text-2xl font-bold text-center text-white">Criar conta</h1>
            <CardDescription className="text-center text-white mt-2">Preencha seus dados para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Digite seu nome" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" placeholder="Crie uma senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmar">Confirmar senha</Label>
                <Input id="confirmar" type="password" placeholder="Repita sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2">{isLoading ? 'Cadastrando...' : 'Cadastrar'}</Button>
              <div className="text-white/90 text-sm text-center">
                Já tem conta? <button type="button" className="underline" onClick={() => navigate('/login')}>Entrar</button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-1">
            <p className="text-xs text-white/80">Desenvolvido por Ctor4.com</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}