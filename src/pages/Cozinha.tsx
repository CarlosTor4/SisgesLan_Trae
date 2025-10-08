import { useEffect, useState } from "react";
import { ChefHat, Calendar, Clock, Timer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import BurgerIcon from "@/assets/burger-icon.svg";

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-2">
          <img src={BurgerIcon} alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ChefHat className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-white">Controle da Cozinha</h2>
            <p className="text-xs text-white/70">Gerencie os pedidos da cozinha</p>
            <div className="flex items-center gap-2 text-white text-xs mt-2">
              <Calendar className="w-3 h-3 text-primary" />
              <span>{currentTime.toLocaleDateString()}</span>
              <Clock className="w-3 h-3 text-primary" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((pedido) => (
          <Dialog key={pedido.id}>
            <DialogTrigger asChild>
              <Card className="border-l-4 border-l-primary cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <img src={BurgerIcon} alt="Logo" className="w-6 h-6" />
                      <h1 className="text-lg font-bold text-yellow-400">Burger & Cia</h1>
                    </div>
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
                    <p className="text-xs text-white/70">Pedido #{pedido.id} - {pedido.tempo}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Itens:</p>
                    <div className="flex flex-wrap gap-2">
                      {pedido.itens.map((item, index) => (
                        <Badge key={index} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-[#1e1e1e] text-white border-gray-700">
              <DialogHeader>
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <img src={BurgerIcon} alt="Logo Burger & Cia" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-yellow-400">Burger & Cia</h1>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ChefHat className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-white">Detalhes do Pedido</h2>
            <p className="text-xs text-white/70">Mesa {pedido.mesa} - Status: {getStatusText(pedido.status)}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-white">
        <Calendar className="w-4 h-4 text-primary" />
        <span>{currentTime.toLocaleDateString()}</span>
        <Clock className="w-4 h-4 text-primary" />
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
    <DialogTitle className="text-white text-lg font-semibold border-t border-border pt-2">
      Mesa {pedido.mesa}
    </DialogTitle>
  </div>
</DialogHeader>
              <div className="space-y-4 py-4">
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
            </DialogContent>
          </Dialog>
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