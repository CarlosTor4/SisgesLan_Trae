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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'Informe o email', description: 'Digite seu email para continuar.' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: 'Erro ao enviar link', description: error.message });
        return;
      }
      toast({
        title: 'Verifique seu email',
        description: 'Se este email existir no sistema, enviaremos as instruções de redefinição.',
      });
      navigate('/login');
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
            <h1 className="text-2xl font-bold text-center text-white">Recuperar senha</h1>
            <CardDescription className="text-center text-white mt-2">Digite seu email para receber o link de redefinição</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendReset} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2">{isLoading ? 'Enviando...' : 'Enviar link de redefinição'}</Button>
              <div className="text-white/90 text-sm text-center">
                Lembrou a senha? <button type="button" className="underline" onClick={() => navigate('/login')}>Entrar</button>
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