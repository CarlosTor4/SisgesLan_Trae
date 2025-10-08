import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Image, ChefHat, Calendar, Clock, ShoppingCart, Timer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import BurgerIcon from "@/assets/burger-icon.svg";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalPedido = itensPedido.reduce((sum, item) => sum + item.total, 0);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <img src={BurgerIcon} alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-white">Burger & Cia</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1e1e1e] text-white border-gray-700">
            <DialogHeader>
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-10 h-10 text-yellow-400" />
          <h1 className="text-2xl font-bold text-yellow-400">Lançamento de Pedidos</h1>
        </div>
        <p className="text-sm text-white/70">Sistema de Controle de Pedidos</p>
      </div>
      <div className="flex items-center gap-2 text-white">
        <Calendar className="w-4 h-4 text-primary" />
        <span>{currentTime.toLocaleDateString()}</span>
        <Clock className="w-4 h-4 text-primary" />
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
    <DialogTitle className="text-white text-lg font-semibold border-t border-border pt-2">
      Novo Pedido
    </DialogTitle>
  </div>
</DialogHeader>
            <div className="space-y-4 py-4">
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
              <Button className="w-full" onClick={adicionarItem}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Informações do Pedido */}
      <Card>
        <CardHeader>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img src={BurgerIcon} alt="Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-white">Painel de Pedidos</h2>
                <p className="text-xs text-white/70">{currentTime.toLocaleString()}</p>
              </div>
            </div>
          </div>
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

      {/* Lista de Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido ({itensPedido.length})</CardTitle>
          <CardDescription>Mesa {mesa || "---"} | Garçom: {garcom || "Não selecionado"} | Total: R$ {totalPedido.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          {itensPedido.length > 0 ? (
            <div className="md:hidden">
              {itensPedido.map((item) => (
                <Card key={item.id} className="mb-4">
                  <CardContent className="p-4 grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{item.produto}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'finalizado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status === 'finalizado' ? 'Finalizado' : 'Pendente'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span>{item.quantidade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço Unit.:</span>
                      <span>R$ {item.precoUnitario.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-muted-foreground">Total:</span>
                      <span>R$ {item.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground border-t pt-2 mt-2">
                      <span>{item.horaAdicao}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => finalizarItemPedido(item.id)}
                        disabled={item.status === 'finalizado'}
                      >
                        Finalizar
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => editarItem(item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => excluirItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
          {itensPedido.length > 0 ? (
            <Table className="hidden md:table">
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
                  <TableRow key={item.id} className="text-white">
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

      <div className="flex justify-end">
        <Button className="w-full sm:w-auto" disabled={itensPedido.length === 0}>
          Finalizar Pedido Completo
        </Button>
      </div>
    </div>
  );
}