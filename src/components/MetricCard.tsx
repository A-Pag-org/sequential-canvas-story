import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant: "success" | "warning" | "danger" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  trend,
  className,
}: MetricCardProps) => {
  const variantClasses = {
    success: "metric-card-success",
    warning: "metric-card-warning", 
    danger: "metric-card-danger",
    info: "metric-card-info",
  };

  return (
    <Card 
      className={cn(
        "metric-card animate-fade-in-scale",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-200" : "text-red-200"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm opacity-80 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-black/10">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
};