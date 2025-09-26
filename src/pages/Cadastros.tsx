import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Package, FolderOpen, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cadastros() {
  const cadastros = [
    {
      title: "Colaboradores",
      description: "Gerencie funcionários e suas informações",
      icon: Users,
      link: "/colaboradores",
      count: "12 cadastrados"
    },
    {
      title: "Produtos",
      description: "Cardápio e itens do restaurante",
      icon: Package,
      link: "/produtos",
      count: "24 itens"
    },
    {
      title: "Tipos de Produtos",
      description: "Categorias e classificações",
      icon: FolderOpen,
      link: "/tipos-produtos",
      count: "8 categorias"
    },
    {
      title: "Mesas",
      description: "Layout e configuração das mesas",
      icon: MapPin,
      link: "/mesas",
      count: "15 mesas"
    },
    {
      title: "Fornecedores",
      description: "Cadastro de fornecedores",
      icon: Phone,
      link: "/fornecedores",
      count: "6 fornecedores"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Cadastros Gerais</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cadastros.map((cadastro, index) => {
          const Icon = cadastro.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cadastro.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {cadastro.count}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {cadastro.description}
                </p>
                <Button asChild className="w-full">
                  <Link to={cadastro.link}>
                    Acessar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configurações básicas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Informações da Empresa</h3>
                <p className="text-sm text-muted-foreground">
                  Nome: Burger & Cia<br />
                  CNPJ: 12.345.678/0001-99<br />
                  Endereço: Rua das Flores, 123
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Configurações do Sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Versão: 1.0.0<br />
                  Última atualização: Hoje<br />
                  Backup: Automático
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}