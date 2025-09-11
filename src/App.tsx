import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import Home from "./pages/Home";
import CityWise from "./pages/CityWise";
import Performance from "./pages/Performance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [activeModule, setActiveModule] = useState("DSP");
  const [activeSection, setActiveSection] = useState("home");
  const [selectedCity, setSelectedCity] = useState("Bahadurghar");

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    setActiveSection(module === "MRS" ? "city-wise" : "home");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "city-wise":
        return <CityWise activeModule={activeModule} selectedCity={selectedCity} onCityChange={setSelectedCity} />;
      case "performance":
        return <Performance activeModule={activeModule} />;
      default:
        return <Home />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <DashboardHeader
              activeModule={activeModule}
              onModuleChange={handleModuleChange}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
            
            <main className="container mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={renderContent()} />
                <Route path="/home" element={<Home />} />
                <Route path="/city-wise" element={<CityWise activeModule={activeModule} selectedCity={selectedCity} onCityChange={setSelectedCity} />} />
                <Route path="/performance" element={<Performance activeModule={activeModule} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
