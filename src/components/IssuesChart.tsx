import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartDataPoint {
  name: string;
  raised: number;
  resolved: number;
  target?: number;
}

interface IssuesChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: "bar" | "composed";
}

export const IssuesChart = ({ title, data, type = "bar" }: IssuesChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === "composed") {
    return (
    <Card className="chart-container animate-card-enter">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="raised"
                name="Issues Raised"
                fill="hsl(var(--chart-2))"
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Issues Resolved"
                stroke="hsl(var(--chart-3))"
                strokeWidth={4}
                dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 3, r: 8 }}
                activeDot={{ r: 10, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-container animate-card-enter">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.6} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              fontWeight={500}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              fontWeight={500}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="target"
              name="Target"
              fill="hsl(var(--chart-3))"
              radius={[6, 6, 0, 0]}
              opacity={0.8}
            />
            <Bar
              dataKey="raised"
              name="Actual"
              fill="hsl(var(--chart-2))"
              radius={[6, 6, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};