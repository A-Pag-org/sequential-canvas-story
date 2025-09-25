import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Variant = "raised" | "resolved";

interface IssueStatCardProps {
  title: string;
  target: number;
  actual: number;
  variant: Variant;
  className?: string;
  leftLabelText?: string;
  rightLabelText?: string;
  subtitle?: string;
}

const bgByVariant: Record<Variant, string> = {
  // Warm amber for "Actual Issues" left card per reference
  raised: "bg-warning text-warning-foreground",
  // Elegant dark slate gradient for resolved summary
  resolved: "bg-[hsl(0_0%_26%)] text-white",
};

export function IssueStatCard({ title, target, actual, variant, className, leftLabelText, rightLabelText, subtitle }: IssueStatCardProps) {
  const pct = target > 0 ? Math.round((actual / target) * 100) : 0;

  const leftLabel = leftLabelText ?? (variant === "raised" ? "Raised" : "Target");
  const rightLabel = rightLabelText ?? (variant === "raised" ? "Resolved" : "Actual");

  return (
    <Card className={cn("rounded-2xl p-5 md:p-6 h-full", bgByVariant[variant], className)}>
      <div className="flex flex-col h-full items-center gap-4">
        <h3 className={cn("text-xl md:text-2xl font-semibold text-center")}>{title}</h3>

        <div className="w-full grid grid-cols-3 items-center gap-2 md:gap-4">
          {/* Left */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-red-600 font-semibold text-sm md:text-base">{target.toLocaleString()}</span>
            </div>
            <span className="mt-2 text-sm md:text-base opacity-90">{leftLabel}</span>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center h-full">
            <div className={cn("w-px h-14 md:h-16", variant === "resolved" ? "bg-white/70" : "bg-black/40")} />
          </div>

          {/* Right */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-red-600 font-semibold text-sm md:text-base">{actual.toLocaleString()}</span>
            </div>
            <span className="mt-2 text-sm md:text-base opacity-90">{rightLabel}</span>
          </div>
        </div>

        <div className="mt-auto w-full flex flex-col items-center">
          <div className="percent-emphasis">{pct}%</div>
          {subtitle && (
            <div className="mt-1 text-center text-xs md:text-sm opacity-80">{subtitle}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
