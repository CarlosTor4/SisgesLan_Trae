import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import burgerHero from '../assets/burger-hero.jpg';
import burgerIcon from '../assets/burger-icon.svg';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { User, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCompatible, setIsCompatible] = useState(true);
  const navigate = useNavigate();

  // Verificar compatibilidade do dispositivo
  useEffect(() => {
    // Verificar se o navegador suporta recursos necessários
    const checkCompatibility = () => {
      const isModernBrowser = 'fetch' in window && 'localStorage' in window;
      setIsCompatible(isModernBrowser);
    };
    
    checkCompatibility();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementação básica de login - em um sistema real, isso seria conectado a uma API
    if (username && password) {
      // Salvar informação de sessão para acesso em outros dispositivos
      localStorage.setItem('sisgeslan_session', JSON.stringify({
        isLoggedIn: true,
        timestamp: new Date().toISOString()
      }));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Alerta de compatibilidade */}
      {!isCompatible && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
          Seu navegador pode não ser totalmente compatível com este sistema. Recomendamos usar Chrome, Firefox ou Edge atualizados.
        </div>
      )}
      
      {/* Imagem de fundo com overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(${burgerHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Conteúdo do login */}
      <div className="z-10 w-full max-w-md px-4 sm:px-6 md:px-8">
        <Card className="w-full bg-white/30 backdrop-blur-sm border-2 border-white/70 shadow-xl">
          <CardHeader className="flex flex-col items-center">
            <img src={burgerIcon} alt="Logo" className="w-24 h-24 mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
              SISTEMA DE GESTÃO DE LANCHONETE
            </h1>
            <CardDescription className="text-center text-white mt-2">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username" className="text-white flex items-center gap-2">
                  <User size={18} className="text-white" />
                  Usuário
                </Label>
                <Input 
                  id="username" 
                  placeholder="Digite seu usuário" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full"
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
                  className="bg-amber-800 border-amber-900 focus:border-amber-900 text-white placeholder:text-white/70 w-full"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-1">
            <p className="text-sm text-white">
              © {new Date().getFullYear()} SisgesLan - Todos os direitos reservados
            </p>
            <p className="text-xs text-white/80">
              Desenvolvido por Ctor4.com | Versão 1.0.0
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}