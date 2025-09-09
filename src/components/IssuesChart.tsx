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
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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

  const BarValueLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value == null) return null;
    const posX = (x || 0) + (width || 0) / 2;
    const posY = (y || 0) - 8;
    return (
      <text
        x={posX}
        y={posY}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill="hsl(var(--foreground))"
      >
        {Number(value).toLocaleString()}
      </text>
    );
  };

  if (type === "composed") {
    return (
    <Card className="chart-container animate-card-enter">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 28 : 24) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
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
                domain={[0, 'dataMax + 10']}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
              <Bar
                dataKey="raised"
                name="Issues Raised"
                fill="hsl(var(--chart-2))"
                radius={[6, 6, 0, 0]}
                barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
              >
                <LabelList dataKey="raised" position="top" content={<BarValueLabel />} />
              </Bar>
              <Line
                type="monotone"
                dataKey="resolved"
                name="Issues Resolved"
                stroke="hsl(var(--chart-3))"
                strokeWidth={4}
                dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 3, r: 8 }}
                activeDot={{ r: 10, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
                isAnimationActive={!isMobile}
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
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
          <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 28 : 24) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
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
                domain={[0, 'dataMax + 10']}
                tickCount={6}
              />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
            <Bar
              dataKey="target"
              name="Target"
              fill="hsl(var(--chart-3))"
              radius={[6, 6, 0, 0]}
              opacity={0.8}
              barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
            >
              <LabelList dataKey="target" position="top" content={<BarValueLabel />} />
            </Bar>
            <Bar
              dataKey="raised"
              name="Actual"
              fill="hsl(var(--chart-2))"
              radius={[6, 6, 0, 0]}
              barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
            >
              <LabelList dataKey="raised" position="top" content={<BarValueLabel />} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
