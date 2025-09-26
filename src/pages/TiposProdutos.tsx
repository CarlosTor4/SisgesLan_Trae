import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Plus, Edit, Trash2 } from "lucide-react";

export default function TiposProdutos() {
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Tipo
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Tipo</CardTitle>
            <CardDescription>Crie uma nova categoria de produtos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Tipos</CardTitle>
              <CardDescription>Gerencie todas as categorias de produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiposProdutos.map((tipo) => (
                    <TableRow key={tipo.id}>
                      <TableCell className="font-medium">{tipo.nome}</TableCell>
                      <TableCell>{tipo.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tipo.qtdProdutos} itens</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tipo.status === "Ativo" ? "default" : "secondary"}>
                          {tipo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
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