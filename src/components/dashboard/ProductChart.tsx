import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const productData = [
  { name: "Trufado", sales: 75000 },
  { name: "Costela Burger", sales: 68000 },
  { name: "Veggie Burger", sales: 45000 },
  { name: "X-Salada", sales: 52000 },
  { name: "X-Bacon", sales: 78000 },
  { name: "Cheeseburger", sales: 61000 },
  { name: "Fish Burger", sales: 43000 },
  { name: "Texano", sales: 55000 },
  { name: "Duplo Cheddar", sales: 65000 },
  { name: "Picante Mexicano", sales: 48000 },
  { name: "Chicken Burger", sales: 59000 },
  { name: "Smash Burger", sales: 72000 },
  { name: "Parrilla Burger", sales: 82000 },
];

export function ProductChart() {
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          2. Desempenho por Produto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <YAxis 
                type="category"
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                width={100}
              />
              <Bar
                dataKey="sales"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}