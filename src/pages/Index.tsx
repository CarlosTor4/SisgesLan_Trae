import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProductChart } from "@/components/dashboard/ProductChart";
import { SalesmanChart } from "@/components/dashboard/SalesmanChart";
import { 
  ShoppingCart, 
  DollarSign, 
  Receipt, 
  Award, 
  Users, 
  TrendingUp 
} from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Vendas Totais"
          value="267"
          subtitle="unidades"
          trend={{ value: "+12.5%", isPositive: true }}
          icon={<ShoppingCart className="h-6 w-6" />}
          className="lg:col-span-1"
        />
        
        <MetricCard
          title="Receita Total"
          value="R$ 676,400"
          subtitle="faturamento"
          trend={{ value: "+18.3%", isPositive: true }}
          icon={<DollarSign className="h-6 w-6" />}
          className="lg:col-span-1"
        />
        
        <MetricCard
          title="Ticket Médio"
          value="R$ 2533.33"
          subtitle="por venda"
          trend={{ value: "+5.2%", isPositive: true }}
          icon={<Receipt className="h-6 w-6" />}
          className="lg:col-span-1"
        />
        
        <MetricCard
          title="Produto Top"
          value="X-Bacon"
          subtitle="mais vendido"
          icon={<Award className="h-6 w-6" />}
          className="lg:col-span-1"
        />
        
        <MetricCard
          title="Vendedor Top"
          value="João Pereira"
          subtitle="maior receita"
          icon={<Users className="h-6 w-6" />}
          className="lg:col-span-1"
        />
        
        <MetricCard
          title="Crescimento"
          value="12.5%"
          subtitle="vs mês anterior"
          trend={{ value: "Meta: 15%", isPositive: true }}
          icon={<TrendingUp className="h-6 w-6" />}
          className="lg:col-span-1"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <ProductChart />
        <SalesmanChart />
        
        {/* Additional placeholder for future charts */}
        <div className="chart-container rounded-lg p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Gráficos adicionais em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;