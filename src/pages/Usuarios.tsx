import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Edit, Trash2, Eye, EyeOff, ChefHat, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function Usuarios() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const usuarios = [
    { id: 1, nome: "Admin Sistema", usuario: "admin", perfil: "Administrador", status: "Ativo", ultimoAcesso: "Hoje" },
    { id: 2, nome: "João Silva", usuario: "joao.silva", perfil: "Garçom", status: "Ativo", ultimoAcesso: "Ontem" },
    { id: 3, nome: "Maria Santos", usuario: "maria.santos", perfil: "Cozinha", status: "Ativo", ultimoAcesso: "02/12/2024" },
    { id: 4, nome: "Pedro Costa", usuario: "pedro.costa", perfil: "Garçom", status: "Inativo", ultimoAcesso: "30/11/2024" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <Key className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Usuários e Senhas</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e1e] text-white border-gray-700 w-[95%] md:w-full rounded-lg">
            <DialogHeader>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
                    <p className="text-sm text-white/70">Sistema de Controle de Usuários</p>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{currentTime.toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
                <DialogTitle className="text-white text-lg font-semibold border-t border-border pt-2">
                  Novo Usuário
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome-usuario">Nome Completo</Label>
                <Input id="nome-usuario" placeholder="Nome do usuário" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input id="login" placeholder="usuario.login" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input 
                    id="senha" 
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite a senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="perfil">Perfil de Acesso</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="garcom">Garçom</SelectItem>
                    <SelectItem value="cozinha">Cozinha</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                Cadastrar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerencie todos os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                  <div className="md:hidden">
                    {usuarios.map((usuario) => (
                      <Card key={usuario.id} className="mb-4">
                        <CardContent className="p-4 grid gap-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{usuario.nome}</span>
                            <Badge variant={usuario.status === "Ativo" ? "default" : "secondary"}>
                              {usuario.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Usuário:</strong> {usuario.usuario}</p>
                            <p><strong>Perfil:</strong> {usuario.perfil}</p>
                            <p><strong>Último Acesso:</strong> {usuario.ultimoAcesso}</p>
                          </div>
                          <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Table className="hidden md:table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.nome}</TableCell>
                          <TableCell>{usuario.usuario}</TableCell>
                          <TableCell><Badge variant="outline">{usuario.perfil}</Badge></TableCell>
                          <TableCell>
                            <Badge variant={usuario.status === "Ativo" ? "default" : "secondary"}>
                              {usuario.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{usuario.ultimoAcesso}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Perfis de Acesso</CardTitle>
              <CardDescription>Configuração de permissões por perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Administrador</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesso total ao sistema, configurações e relatórios
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Garçom</h4>
                  <p className="text-sm text-muted-foreground">
                    Lançamento de pedidos e consulta de mesas
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Cozinha</h4>
                  <p className="text-sm text-muted-foreground">
                    Controle de preparo e baixa de pedidos
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Gerente</h4>
                  <p className="text-sm text-muted-foreground">
                    Relatórios, cadastros e supervisão geral
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}