import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const modules = [
  { id: "DSP", label: "DSP" },
  { id: "MRS", label: "MRS" },
  { id: "C&D", label: "C&D" },
];

const defaultSections = [
  { id: "home", label: "Home" },
  { id: "city-wise", label: "City Wise" },
  { id: "performance", label: "Performance" },
];

const mrsSections = [
  { id: "city-wise", label: "City Wise" },
  { id: "performance", label: "Performance" },
];

const cities = [
  "Bahadurgarh",
  "Delhi",
  "Faridabad",
  "Ghaziadabad",
  "Greater Noida",
  "Noida",
  "Gurgaon",
  "Manesar",
];

export const DashboardHeader = ({
  activeModule,
  onModuleChange,
  activeSection,
  onSectionChange,
  selectedCity,
  onCityChange,
}: DashboardHeaderProps) => {
  return (
    <header className="dashboard-header">
      <div className="container mx-auto px-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-3 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MoHUA Dashboard</h1>
              <p className="text-sm text-white/85">Ministry of Housing and Urban Affairs</p>
            </div>
          </div>
          <div className="flex gap-3">
            {modules.map((module) => (
              <Button
                key={module.id}
                variant="ghost"
                size="sm"
                onClick={() => onModuleChange(module.id)}
                aria-pressed={activeModule === module.id}
                className={cn(
                  "nav-button transition-all duration-300",
                  activeModule === module.id
                    ? "nav-button-active"
                    : "nav-button-inactive"
                )}
              >
                {module.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex gap-3 py-2">
          {(activeModule === "MRS" ? mrsSections : defaultSections).map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange(section.id)}
              aria-current={activeSection === section.id ? "page" : undefined}
              className={cn(
                "nav-button transition-all duration-300 relative",
                activeSection === section.id
                  ? "nav-button-active"
                  : "nav-button-inactive"
              )}
            >
              {section.label}
              {activeSection === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/60 rounded-full" />
              )}
            </Button>
          ))}
        </div>

        {activeSection === "city-wise" && (
          <div className="grid grid-cols-8 gap-1 py-1 border-t border-white/10">
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => onCityChange(city)}
                className="nav-button h-8 px-2 text-xs truncate"
              >
                {city}
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
