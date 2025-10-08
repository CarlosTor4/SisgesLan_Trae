import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Edit, Trash2, ChefHat, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function TiposProdutos() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tiposProdutos = [
    { id: 1, nome: "Hambúrguer", descricao: "Sanduíches e hambúrgueres", qtdProdutos: 8, status: "Ativo" },
    { id: 2, nome: "Bebida", descricao: "Refrigerantes, sucos e águas", qtdProdutos: 12, status: "Ativo" },
    { id: 3, nome: "Acompanhamento", descricao: "Batatas, onion rings, etc", qtdProdutos: 5, status: "Ativo" },
    { id: 4, nome: "Sobremesa", descricao: "Doces e sobremesas", qtdProdutos: 3, status: "Inativo" },
    { id: 5, nome: "Porção", descricao: "Porções diversas", qtdProdutos: 6, status: "Ativo" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Tipos de Produtos</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e1e] text-white border-gray-700 sm:max-w-[625px]">
            <DialogHeader>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
                    <p className="text-sm text-white/70">Sistema de Controle de Tipos de Produtos</p>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{currentTime.toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
                <DialogTitle className="text-white text-lg font-semibold border-t border-border pt-2">
                  Novo Tipo
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome-tipo">Nome do Tipo</Label>
                <Input id="nome-tipo" placeholder="Ex: Hambúrguer, Bebida" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao-tipo">Descrição</Label>
                <Input id="descricao-tipo" placeholder="Descrição da categoria" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cor">Cor da Categoria</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input id="cor" type="color" className="w-16 h-10" />
                  <Input placeholder="#ffffff" className="flex-1" />
                </div>
              </div>

              <Button className="w-full">
                Cadastrar Tipo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Tipos</CardTitle>
              <CardDescription>Gerencie todas as categorias de produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead className="text-primary">Nome</TableHead>
                    <TableHead className="text-primary">Descrição</TableHead>
                    <TableHead className="text-primary">Produtos</TableHead>
                    <TableHead className="text-primary">Status</TableHead>
                    <TableHead className="text-primary">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiposProdutos.map((tipo) => (
                    <TableRow key={tipo.id} className="flex flex-col md:table-row mb-4 md:mb-0 border rounded-lg md:border-none md:rounded-none">
                      <TableCell className="font-medium md:py-4 py-2 px-4 border-b md:border-none"><strong>Nome:</strong> {tipo.nome}</TableCell>
                      <TableCell className="md:py-4 py-2 px-4 border-b md:border-none"><strong>Descrição:</strong> {tipo.descricao}</TableCell>
                      <TableCell className="md:py-4 py-2 px-4 border-b md:border-none">
                        <strong>Produtos:</strong> <Badge variant="outline">{tipo.qtdProdutos} itens</Badge>
                      </TableCell>
                      <TableCell className="md:py-4 py-2 px-4 border-b md:border-none">
                        <strong>Status:</strong> <Badge variant={tipo.status === "Ativo" ? "default" : "secondary"}>
                          {tipo.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="md:py-4 py-2 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}