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

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast({ title: 'Campos obrigatórios', description: 'Informe e confirme a nova senha.' });
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
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({ title: 'Erro ao redefinir', description: error.message });
        return;
      }
      if (data.user) {
        toast({ title: 'Senha redefinida', description: 'Faça login com sua nova senha.' });
        navigate('/login');
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
            <h1 className="text-2xl font-bold text-center text-white">Redefinir senha</h1>
            <CardDescription className="text-center text-white mt-2">Crie sua nova senha para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senha">Nova senha</Label>
                <Input id="senha" type="password" placeholder="Digite a nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmar">Confirmar nova senha</Label>
                <Input id="confirmar" type="password" placeholder="Repita a nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2">{isLoading ? 'Redefinindo...' : 'Redefinir senha'}</Button>
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