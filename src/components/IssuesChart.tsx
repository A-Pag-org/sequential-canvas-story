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
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChartDataPoint {
  name: string;
  raised?: number;
  resolved?: number;
  target?: number;
  actualResolved?: number;
  actualRaised?: number;
  targetResolved?: number;
}

interface IssuesChartProps<TEntry extends ChartDataPoint = ChartDataPoint> {
  title: string;
  data: TEntry[];
  type?: "bar" | "composed" | "stacked-line" | "double";
  showTarget?: boolean;
  showActual?: boolean;
  valueSuffix?: string;
  showLegend?: boolean;
  showPercentOfTarget?: boolean;
  getBarFill?: (entry: TEntry, index: number) => string;
}

export const IssuesChart = <TEntry extends ChartDataPoint = ChartDataPoint>({ title, data, type = "bar", showTarget = true, showActual = true, valueSuffix, showLegend = true, showPercentOfTarget = false, getBarFill }: IssuesChartProps<TEntry>) => {
  const isMobile = useIsMobile();
  const xTickProps = isMobile ? { angle: -55 as const, textAnchor: "end" as const } : { angle: -35 as const, textAnchor: "end" as const };
  type TooltipEntry = { name: string; value: number; color: string; dataKey: string; payload: TEntry };
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) => {
    if (active && payload && payload.length) {
      let pct: number | undefined;
      if (type === "stacked-line" || type === "double") {
        const num = payload.find((p) => p.dataKey === "actualResolved")?.value as number | undefined;
        const den = payload.find((p) => p.dataKey === "actualRaised")?.payload?.actualRaised as number | undefined;
        if (typeof num === "number" && typeof den === "number" && den > 0) pct = Math.round((num / den) * 100);
      } else {
        const targetEntry = payload.find((p) => p.dataKey === 'target');
        const actualEntry = payload.find((p) => p.dataKey === 'raised');
        const targetVal = targetEntry?.value as number | undefined;
        const actualVal = actualEntry?.value as number | undefined;
        pct = showPercentOfTarget && showTarget && showActual && typeof targetVal === 'number' && targetVal > 0 && typeof actualVal === 'number'
          ? Math.round((actualVal / targetVal) * 100)
          : undefined;
      }

      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}{valueSuffix ?? ""}
              {pct != null && entry.dataKey === 'actualResolved' ? ` (${pct}%)` : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const BarValueLabel = (props: { x?: number; y?: number; width?: number; value?: number | string }) => {
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
        {Number(value).toLocaleString()}{valueSuffix ?? ""}
      </text>
    );
  };


  if (type === "double") {
    const getResolvedFill = (entry: TEntry) => {
      const numerator = Number((entry as any).actualResolved) || 0;
      const denominator = Number((entry as any).actualRaised) || 0;
      const pct = denominator > 0 ? (numerator / denominator) * 100 : 0;
      if (pct > 90) return "#4CAF50"; // Green
      if (pct >= 80 && pct <= 90) return "#FFC107"; // Amber
      return "#F44336"; // Red
    };

    const PercentLabel = (props: { x?: number; y?: number; width?: number; value?: number; payload?: TEntry }) => {
      const { x, y, width, payload } = props;
      const resolved = Number((payload as any)?.actualResolved) || 0;
      const raised = Number((payload as any)?.actualRaised) || 0;
      if (!raised) return null;
      const pct = Math.round((resolved / raised) * 100);
      const posX = (x || 0) + (width || 0) / 2;
      const posY = (y || 0) - 22; // slightly above the absolute value label
      return (
        <text
          x={posX}
          y={posY}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill="hsl(var(--muted-foreground))"
        >
          {pct}%
        </text>
      );
    };

    return (
      <Card className="chart-container animate-card-enter">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 360 : 460}>
            <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 64 : 56) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} interval={0} tick={xTickProps} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} domain={[0, 'dataMax + 10']} tickCount={6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
              <Bar dataKey="actualRaised" name="Actual Raised" fill="#000000" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 28} isAnimationActive={!isMobile}>
                <LabelList dataKey="actualRaised" position="top" content={<BarValueLabel />} />
              </Bar>
              <Bar dataKey="actualResolved" name="Actual Resolved" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 28} isAnimationActive={!isMobile}>
                {data.map((entry, index) => (
                  <Cell key={`cell-double-${index}`} fill={getResolvedFill(entry as TEntry)} />
                ))}
                <LabelList dataKey="actualResolved" position="top" content={<BarValueLabel />} />
                <LabelList dataKey="actualResolved" position="top" content={<PercentLabel />} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }


  if (type === "composed") {
    return (
    <Card className="chart-container animate-card-enter">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 360 : 460}>
            <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 64 : 56) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
                interval={0}
                tick={xTickProps}
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
                {getBarFill && data.map((entry, index) => (
                  <Cell key={`cell-composed-${index}`} fill={getBarFill(entry as TEntry, index)} />
                ))}
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

  if (type === "stacked-line") {
    return (
      <Card className="chart-container animate-card-enter">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={isMobile ? 360 : 460}>
            <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 64 : 56) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} interval={0} tick={xTickProps} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} domain={[0, 'dataMax + 10']} tickCount={6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
              <Bar dataKey="actualResolved" name="Actual Resolved" fill="hsl(var(--chart-2))" stackId="a" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 28} isAnimationActive={!isMobile}>
                <LabelList dataKey="actualResolved" position="top" content={<BarValueLabel />} />
              </Bar>
              <Bar dataKey="targetResolved" name="Target Resolved" fill="hsl(var(--chart-5))" stackId="a" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 28} isAnimationActive={!isMobile} />
              <Line type="monotone" dataKey="actualRaised" name="Actual Raised" stroke="#000000" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} isAnimationActive={!isMobile} />
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
        <ResponsiveContainer width="100%" height={isMobile ? 360 : 460}>
          <ComposedChart data={data} margin={{ top: (isMobile ? 56 : 40), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isMobile ? 64 : 56) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              fontWeight={500}
              interval={0}
              tick={xTickProps}
            />
            <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                fontWeight={500}
                domain={[0, 'dataMax + 10']}
                tickCount={6}
              />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
            )}
            {showTarget && (
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
            )}
            {showActual && (
              <Bar
                dataKey="raised"
                name="Actual"
                fill="hsl(var(--chart-2))"
                radius={[6, 6, 0, 0]}
                barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
              >
                {getBarFill && data.map((entry, index) => (
                  <Cell key={`cell-default-${index}`} fill={getBarFill(entry as TEntry, index)} />
                ))}
                <LabelList dataKey="raised" position="top" content={<BarValueLabel />} />
              </Bar>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
