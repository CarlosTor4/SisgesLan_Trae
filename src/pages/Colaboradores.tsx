import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([
    { id: 1, nome: "João Silva", cargo: "Garçom", status: "Ativo", telefone: "(11) 99999-9999", email: "joao@empresa.com" },
    { id: 2, nome: "Maria Santos", cargo: "Cozinheira", status: "Ativo", telefone: "(11) 88888-8888", email: "maria@empresa.com" },
    { id: 3, nome: "Pedro Costa", cargo: "Garçom", status: "Inativo", telefone: "(11) 77777-7777", email: "pedro@empresa.com" },
    { id: 4, nome: "Ana Oliveira", cargo: "Atendente", status: "Ativo", telefone: "(11) 66666-6666", email: "ana@empresa.com" },
  ]);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const adicionarColaborador = () => {
    if (nome && cargo && telefone && email) {
      const novoColaborador = {
        id: Date.now(),
        nome,
        cargo,
        telefone,
        email,
        status: "Ativo"
      };
      
      setColaboradores([...colaboradores, novoColaborador]);
      setNome("");
      setCargo("");
      setTelefone("");
      setEmail("");
    }
  };

  const excluirColaborador = (id: number) => {
    setColaboradores(colaboradores.filter(colaborador => colaborador.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Colaboradores</h1>
      </div>

      {/* Formulário de Cadastro */}
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Colaborador</CardTitle>
          <CardDescription>Adicione um novo colaborador ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input 
                id="nome" 
                placeholder="Nome do colaborador" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Garçom">Garçom</SelectItem>
                  <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                  <SelectItem value="Cozinheira">Cozinheira</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Atendente">Atendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone" 
                placeholder="(11) 99999-9999" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="colaborador@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full" onClick={adicionarColaborador}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Colaborador
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Colaboradores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Colaboradores ({colaboradores.length})</CardTitle>
          <CardDescription>Gerencie os colaboradores cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {colaboradores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colaboradores.map((colaborador) => (
                  <TableRow key={colaborador.id}>
                    <TableCell className="font-medium">{colaborador.nome}</TableCell>
                    <TableCell>{colaborador.cargo}</TableCell>
                    <TableCell>{colaborador.telefone}</TableCell>
                    <TableCell>{colaborador.email}</TableCell>
                    <TableCell>
                      <Badge variant={colaborador.status === "Ativo" ? "default" : "secondary"}>
                        {colaborador.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log("Editar:", colaborador.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirColaborador(colaborador.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum colaborador cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}