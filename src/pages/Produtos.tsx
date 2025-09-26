import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Edit, Trash2 } from "lucide-react";

export default function Produtos() {
  const produtos = [
    { id: 1, nome: "X-Bacon", categoria: "Hambúrguer", preco: "R$ 12,00", status: "Ativo" },
    { id: 2, nome: "X-Burger", categoria: "Hambúrguer", preco: "R$ 10,00", status: "Ativo" },
    { id: 3, nome: "X-Salada", categoria: "Hambúrguer", preco: "R$ 8,00", status: "Ativo" },
    { id: 4, nome: "Coca-Cola", categoria: "Bebida", preco: "R$ 5,00", status: "Ativo" },
    { id: 5, nome: "Batata Frita", categoria: "Acompanhamento", preco: "R$ 6,00", status: "Inativo" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Produtos</h1>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Produto</CardTitle>
            <CardDescription>Adicione um novo produto ao cardápio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-produto">Nome do Produto</Label>
              <Input id="nome-produto" placeholder="Ex: X-Bacon" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hamburguer">Hambúrguer</SelectItem>
                  <SelectItem value="bebida">Bebida</SelectItem>
                  <SelectItem value="acompanhamento">Acompanhamento</SelectItem>
                  <SelectItem value="sobremesa">Sobremesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco-produto">Preço</Label>
              <Input id="preco-produto" placeholder="R$ 0,00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" placeholder="Descrição do produto" />
            </div>

            <Button className="w-full">
              Cadastrar Produto
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos</CardTitle>
              <CardDescription>Gerencie todos os produtos do cardápio</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>{produto.preco}</TableCell>
                      <TableCell>
                        <Badge variant={produto.status === "Ativo" ? "default" : "secondary"}>
                          {produto.status}
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