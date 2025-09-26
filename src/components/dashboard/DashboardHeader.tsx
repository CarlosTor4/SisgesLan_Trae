import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Download, LogOut } from "lucide-react";
import heroImage from "@/assets/burger-hero.jpg";

export function DashboardHeader() {
  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="hero-section relative min-h-[300px] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                Fonte: XLSX
              </div>
              <div className="text-xs text-muted-foreground">
                Atualizado: {currentTime}
              </div>
            </div>
            
            <div>
              <h1 className="text-5xl font-bold text-gradient mb-2">
                Burger & Cia
              </h1>
              <p className="text-xl text-card-foreground/80">
                Dashboard de Controle de Vendas
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-success">130 registros</span> • fonte: XLSX
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">De:</div>
              <Button variant="outline" size="sm" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Selecionar
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground">Até:</div>
              <Button variant="outline" size="sm" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Selecionar
              </Button>
            </div>
            
            <Button className="glow">
              <Download className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}