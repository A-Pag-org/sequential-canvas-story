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
  orientation?: "vertical" | "horizontal";
}

export const IssuesChart = <TEntry extends ChartDataPoint = ChartDataPoint>({ title, data, type = "bar", showTarget = true, showActual = true, valueSuffix, showLegend = true, showPercentOfTarget = false, getBarFill, orientation = "vertical" }: IssuesChartProps<TEntry>) => {
  const isMobile = useIsMobile();
  const xTickProps = { angle: 0 as const, textAnchor: "middle" as const };
  const isHorizontal = orientation === "horizontal" || (!!valueSuffix && valueSuffix.includes("%") && showActual && !showTarget && type === "bar");
  const isPercentOnly = !!valueSuffix && valueSuffix.includes('%') && showActual && !showTarget && type === 'bar';

  const getDspThresholdFill = (value: number) => {
    if (value >= 90) return '#4CAF50'; // Satisfactory
    if (value >= 50) return '#FFC107'; // Average
    return '#F44336'; // Unsatisfactory
  };

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

  const BarInsideLabel = (props: { x?: number; y?: number; width?: number; height?: number; value?: number | string }) => {
    const { x, y, width, height, value } = props;
    if (value == null) return null;
    const numeric = Number(value);
    const label = `${numeric.toLocaleString()}${valueSuffix ?? ""}`;
    const barWidth = width || 0;
    const threshold = 36; // px width threshold to decide inside vs outside
    const isInside = barWidth > threshold;
    const posY = (y || 0) + (height || 0) / 2 + 1;
    const posX = isInside ? (x || 0) + barWidth - 6 : (x || 0) + barWidth + 6;
    return (
      <text
        x={posX}
        y={posY}
        textAnchor={isInside ? "end" : "start"}
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={700}
        fill={isInside ? "#ffffff" : "hsl(var(--foreground))"}
        stroke={isInside ? "#000000" : "none"}
        strokeWidth={isInside ? 0.6 : 0}
        style={isInside ? ({ paintOrder: 'stroke' as const }) : undefined}
      >
        {label}
      </text>
    );
  };


  if (type === "double") {
    const getResolvedFill = (entry: TEntry) => {
      const numerator = Number((entry as any).actualResolved) || 0;
      const denominator = Number((entry as any).actualRaised) || 0;
      const pct = denominator > 0 ? (numerator / denominator) * 100 : 0;
      return getDspThresholdFill(pct);
    };

    const PercentLabel = (props: { x?: number; y?: number; width?: number; height?: number; value?: number; payload?: TEntry }) => {
      const { x, y, width, height, payload } = props;
      const resolved = Number((payload as any)?.actualResolved) || 0;
      const raised = Number((payload as any)?.actualRaised) || 0;
      if (!raised) return null;
      const pct = Math.round((resolved / raised) * 100);
      const barHeight = height || 0;
      const isInside = barHeight >= 18; // readable threshold
      const posX = (x || 0) + (width || 0) / 2;
      const posY = isInside ? (y || 0) + 14 : (y || 0) - 6; // inside when tall, above when short
      const fillColor = getResolvedFill(payload as TEntry);
      const textFill = isInside
        ? (fillColor === '#FFC107' ? '#111827' : '#ffffff')
        : 'hsl(var(--foreground))';
      return (
        <text
          x={posX}
          y={posY}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill={textFill}
          stroke={isInside ? '#000000' : 'none'}
          strokeWidth={isInside ? 0.6 : 0}
          style={isInside ? ({ paintOrder: 'stroke' as const }) : undefined}
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
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} interval={0} tick={xTickProps} tickMargin={isMobile ? 12 : 16} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} domain={[0, 'dataMax + 10']} tickCount={6} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
              <Bar dataKey="actualRaised" name="Actual Raised" fill="#555555" radius={[6, 6, 0, 0]} barSize={isMobile ? 20 : 28} isAnimationActive={!isMobile}>
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
          {/* DSP Color legend */}
          <div className="mt-3 flex w-full items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#4CAF50' }} />
              <span>{'Satisfactory (>= 90%)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#FFC107' }} />
              <span>{'Average (50% - 89%)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#F44336' }} />
              <span>{'Unsatisfactory (< 50%)'}</span>
            </div>
          </div>
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
                tickMargin={isMobile ? 12 : 16}
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
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} fontWeight={500} interval={0} tick={xTickProps} tickMargin={isMobile ? 12 : 16} />
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
          <ComposedChart data={data} layout={isHorizontal ? 'vertical' : 'horizontal'} margin={{ top: (isHorizontal ? 24 : (isMobile ? 56 : 40)), right: (isMobile ? 16 : 30), left: (isMobile ? 12 : 20), bottom: (isHorizontal ? 24 : (isMobile ? 64 : 56)) }} barCategoryGap={isMobile ? '35%' : '20%'} barGap={isMobile ? 2 : 4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={500}
                  domain={[0, 'dataMax + 10']}
                  tickCount={6}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={500}
                  interval={0}
                  tickMargin={8}
                  width={isMobile ? 112 : 196}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontWeight={500}
                  interval={0}
                  tick={xTickProps}
                  tickMargin={isMobile ? 12 : 16}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontWeight={500}
                    domain={[0, 'dataMax + 10']}
                    tickCount={6}
                  />
              </>
            )}
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend wrapperStyle={{ fontSize: isMobile ? 12 : 14 }} verticalAlign="bottom" align="center" />
            )}
            {showTarget && (
              <Bar
                dataKey="target"
                name="Target"
                fill="hsl(var(--chart-3))"
                radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
                opacity={0.8}
                barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
              >
                <LabelList dataKey="target" position={isHorizontal ? "insideRight" : "top"} content={isHorizontal ? <BarInsideLabel /> : <BarValueLabel />} />
              </Bar>
            )}
            {showActual && (
              <Bar
                dataKey="raised"
                name="Actual"
                fill="hsl(var(--chart-2))"
                radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
                barSize={isMobile ? 20 : 28}
                isAnimationActive={!isMobile}
              >
                {(getBarFill || isPercentOnly) && data.map((entry, index) => (
                  <Cell key={`cell-default-${index}`} fill={(getBarFill ? getBarFill(entry as TEntry, index) : getDspThresholdFill(Number((entry as any).raised) || 0))} />
                ))}
                <LabelList dataKey="raised" position={isHorizontal ? "insideRight" : "top"} content={isHorizontal ? <BarInsideLabel /> : <BarValueLabel />} />
              </Bar>
            )}
          </ComposedChart>
        </ResponsiveContainer>
        {isPercentOnly && (
          <div className="mt-3 flex w-full items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#4CAF50' }} />
              <span>{'Satisfactory (>= 90%)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#FFC107' }} />
              <span>{'Average (50% - 89%)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: '#F44336' }} />
              <span>{'Unsatisfactory (< 50%)'}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
