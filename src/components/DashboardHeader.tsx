import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const modules = [
  { id: "DSP", label: "DSP" },
  { id: "MRS", label: "MRS" },
  { id: "C&D", label: "C&D" },
];

const sections = [
  { id: "home", label: "Home" },
  { id: "city-wise", label: "City Wise" },
  { id: "performance", label: "Performance" },
];

export const DashboardHeader = ({
  activeModule,
  onModuleChange,
  activeSection,
  onSectionChange,
}: DashboardHeaderProps) => {
  return (
    <header className="dashboard-header">
      <div className="container mx-auto px-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-4 border-b border-white/20">
          <h1 className="text-2xl font-bold">MoHUA Dashboard</h1>
          <div className="flex gap-2">
            {modules.map((module) => (
              <Button
                key={module.id}
                variant="ghost"
                size="sm"
                onClick={() => onModuleChange(module.id)}
                className={cn(
                  "nav-button",
                  activeModule === module.id
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {module.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex gap-2 py-4">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "nav-button",
                activeSection === section.id
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};