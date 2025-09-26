import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, CheckCircle, Timer } from "lucide-react";
import { useState } from "react";

export default function Cozinha() {
  const [pedidos, setPedidos] = useState([
    { 
      id: 1, 
      mesa: "05", 
      itens: ["2x X-Bacon", "1x Batata Frita"], 
      tempo: "10 min", 
      status: "preparando",
      horaPedido: "14:30:45",
      horaInicio: "14:35:12",
      horaFinalizacao: null
    },
    { 
      id: 2, 
      mesa: "12", 
      itens: ["1x X-Salada", "2x Coca-Cola"], 
      tempo: "5 min", 
      status: "pendente",
      horaPedido: "14:28:22",
      horaInicio: null,
      horaFinalizacao: null
    },
    { 
      id: 3, 
      mesa: "08", 
      itens: ["3x X-Burger", "1x Suco"], 
      tempo: "15 min", 
      status: "preparando",
      horaPedido: "14:25:33",
      horaInicio: "14:27:45",
      horaFinalizacao: null
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-500";
      case "preparando": return "bg-blue-500";
      case "pronto": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente": return "Pendente";
      case "preparando": return "Preparando";
      case "pronto": return "Pronto";
      default: return "Desconhecido";
    }
  };

  const iniciarPreparo = (id: number) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id 
        ? { ...pedido, status: "preparando", horaInicio: new Date().toLocaleTimeString() }
        : pedido
    ));
  };

  const marcarComoPronto = (id: number) => {
    setPedidos(pedidos.map(pedido => 
      pedido.id === id 
        ? { ...pedido, status: "pronto", horaFinalizacao: new Date().toLocaleTimeString() }
        : pedido
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ChefHat className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Controle da Cozinha</h1>
      </div>

      <div className="grid gap-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mesa {pedido.mesa}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getStatusColor(pedido.status)} text-white`}>
                    {getStatusText(pedido.status)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {pedido.tempo}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Horários do Pedido */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      <span className="font-medium">Pedido:</span>
                      <span>{pedido.horaPedido}</span>
                    </div>
                    {pedido.horaInicio && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">Início:</span>
                        <span>{pedido.horaInicio}</span>
                      </div>
                    )}
                    {pedido.horaFinalizacao && (
                      <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        <span className="font-medium">Entrega:</span>
                        <span>{pedido.horaFinalizacao}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div>
                  <p className="font-medium mb-2">Itens do Pedido:</p>
                  <div className="space-y-2">
                    {pedido.itens.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">{item}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => console.log(`Finalizar item: ${item}`)}
                        >
                          Finalizar Item
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Botões de Ação */}
                <div className="flex gap-2">
                  {pedido.status === "pendente" && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => iniciarPreparo(pedido.id)}
                    >
                      Iniciar Preparo
                    </Button>
                  )}
                  {pedido.status === "preparando" && (
                    <Button 
                      className="flex-1"
                      onClick={() => marcarComoPronto(pedido.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Pronto
                    </Button>
                  )}
                  {pedido.status === "pronto" && (
                    <div className="flex-1 p-2 bg-green-100 text-green-800 rounded text-center font-medium">
                      ✅ Pedido Finalizado - Entregue às {pedido.horaFinalizacao}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pedidos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido pendente na cozinha</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}