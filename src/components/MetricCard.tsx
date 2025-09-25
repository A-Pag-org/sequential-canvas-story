import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant: "success" | "warning" | "danger" | "info" | "primary" | "neutral";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  headingOverride?: string;
  headingClassName?: string;
  emphasizeValue?: boolean;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  trend,
  className,
  headingOverride,
  headingClassName,
  emphasizeValue,
}: MetricCardProps) => {
  const variantClasses = {
    success: "metric-card-success",
    warning: "metric-card-warning",
    danger: "metric-card-danger",
    info: "metric-card-info",
    primary: "metric-card-primary",
    neutral: "metric-card-neutral",
  };

  return (
    <Card 
      className={cn(
        "metric-card animate-card-enter interactive-hover h-full",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {headingOverride ? (
              <h3 className={cn("text-lg font-semibold text-foreground", headingClassName)}>
                {headingOverride}
              </h3>
            ) : (
              <>
                <h3 className="text-sm font-medium opacity-90 mb-3">{title}</h3>
                <div className="flex items-baseline gap-3">
                  {emphasizeValue ? (
                    <span className="value-badge text-xl">{value}</span>
                  ) : (
                    <span className="text-3xl font-bold tracking-tight">{value}</span>
                  )}
                  {trend && (
                    <span
                      className={cn(
                        "text-sm font-medium px-2 py-1 rounded-full transition-all duration-300",
                        trend.isPositive
                          ? "text-success-light bg-success/10"
                          : "text-danger-light bg-danger/10"
                      )}
                    >
                      {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                    </span>
                  )}
                </div>
              {subtitle && !/%$/.test(subtitle) && (
                <p className="text-sm opacity-80 mt-2 leading-relaxed">{subtitle}</p>
              )}
              </>
            )}
          </div>
          {Icon && (
            <div className="p-3 rounded-xl bg-black/10 animate-float">
              <Icon className="h-7 w-7" />
            </div>
          )}
        </div>
        {subtitle && /%$/.test(subtitle) && (
          <div className="mt-auto w-full flex items-center justify-start">
            <div className="percent-emphasis inline-flex">{subtitle}</div>
          </div>
        )}
      </div>
    </Card>
  );
};
