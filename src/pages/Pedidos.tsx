import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, Plus, Edit, Trash2, Clock } from "lucide-react";
import { useState } from "react";

export default function Pedidos() {
  const [itensPedido, setItensPedido] = useState([
    { 
      id: 1, 
      produto: "X-Bacon", 
      quantidade: 2, 
      precoUnitario: 12.00, 
      total: 24.00,
      status: "pendente",
      horaAdicao: new Date().toLocaleTimeString()
    },
    { 
      id: 2, 
      produto: "Coca-Cola", 
      quantidade: 1, 
      precoUnitario: 5.00, 
      total: 5.00,
      status: "pendente", 
      horaAdicao: new Date().toLocaleTimeString()
    }
  ]);

  const [mesa, setMesa] = useState("");
  const [garcom, setGarcom] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState("");

  const totalPedido = itensPedido.reduce((sum, item) => sum + item.total, 0);
  const horaPedido = new Date().toLocaleString();

  const adicionarItem = () => {
    if (produto && quantidade && preco) {
      const novoItem = {
        id: Date.now(),
        produto,
        quantidade: Number(quantidade),
        precoUnitario: Number(preco),
        total: Number(quantidade) * Number(preco),
        status: "pendente",
        horaAdicao: new Date().toLocaleTimeString()
      };
      
      setItensPedido([...itensPedido, novoItem]);
      setProduto("");
      setQuantidade(1);
      setPreco("");
    }
  };

  const editarItem = (id: number) => {
    // Implementar lógica de edição
    console.log("Editar item:", id);
  };

  const excluirItem = (id: number) => {
    setItensPedido(itensPedido.filter(item => item.id !== id));
  };

  const finalizarItemPedido = (id: number) => {
    setItensPedido(itensPedido.map(item => 
      item.id === id ? { ...item, status: "finalizado" } : item
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Lançamento de Pedidos</h1>
      </div>

      {/* Informações do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Informações do Pedido - {horaPedido}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mesa">Mesa</Label>
              <Input 
                id="mesa" 
                placeholder="Número da mesa" 
                value={mesa}
                onChange={(e) => setMesa(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garcom">Garçom</Label>
              <Select value={garcom} onValueChange={setGarcom}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o garçom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário Novo Item com Resumo */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Item ao Pedido</CardTitle>
          <CardDescription>Mesa {mesa || "---"} | Garçom: {garcom || "Não selecionado"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Select value={produto} onValueChange={setProduto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="X-Bacon">X-Bacon</SelectItem>
                <SelectItem value="X-Burger">X-Burger</SelectItem>
                <SelectItem value="X-Salada">X-Salada</SelectItem>
                <SelectItem value="Coca-Cola">Coca-Cola</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input 
                id="quantidade" 
                type="number" 
                placeholder="1" 
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Unitário</Label>
              <Input 
                id="preco" 
                placeholder="R$ 0,00" 
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" onClick={adicionarItem}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
            
            <div className="text-center p-2 bg-muted rounded-lg flex flex-col justify-center">
              <p className="text-lg font-bold text-primary">R$ {totalPedido.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total do Pedido</p>
            </div>
          </div>
          
          <Button className="w-full" disabled={itensPedido.length === 0}>
            Finalizar Pedido Completo
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido ({itensPedido.length})</CardTitle>
          <CardDescription>Gerencie os itens adicionados ao pedido</CardDescription>
        </CardHeader>
        <CardContent>
          {itensPedido.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensPedido.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.produto}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {item.precoUnitario.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">R$ {item.total.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{item.horaAdicao}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === 'finalizado' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'finalizado' ? 'Finalizado' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => finalizarItemPedido(item.id)}
                          disabled={item.status === 'finalizado'}
                        >
                          Finalizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editarItem(item.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => excluirItem(item.id)}
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
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum item adicionado ao pedido</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}