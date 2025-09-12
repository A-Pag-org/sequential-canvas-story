import { MetricCard } from "@/components/MetricCard";
import { IssuesChart } from "@/components/IssuesChart";
import { Target, Trophy, ArrowDownCircle } from "lucide-react";

interface PerformanceProps {
  activeModule?: string;
}


const Performance = ({ activeModule }: PerformanceProps) => {

  if (activeModule === "MRS") {
    const cityPercents = [
      { city: "Baharudgarh", percent: 12 },
      { city: "Delhi", percent: 38 },
      { city: "Faridabad", percent: 19 },
      { city: "Ghaziabad", percent: 83 },
      { city: "Greater Noida", percent: 29 },
      { city: "Gurgaon", percent: 56 },
      { city: "Manesar", percent: 5 },
      { city: "Noida", percent: 64 },
    ];

    const best = cityPercents.reduce((a, b) => (b.percent > a.percent ? b : a));
    const lagging = cityPercents.reduce((a, b) => (b.percent < a.percent ? b : a));
    const overall = 38; // Overall Avg

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Overall (% malba collected/target)"
            value={`${overall}%`}
            icon={Target}
            variant="info"
          />
          <MetricCard
            title="Best city"
            headingOverride={`Best city ${best.city} ${best.percent}%`}
            icon={Trophy}
            variant="success"
          />
          <MetricCard
            title="Lagging city"
            headingOverride={`Lagging city ${lagging.city} ${lagging.percent}%`}
            icon={ArrowDownCircle}
            variant="danger"
          />
        </div>

        <IssuesChart
          title="Active SCC"
          data={[
            { name: "Baharudgarh", raised: 100 },
            { name: "Delhi", raised: 81 },
            { name: "Faridabad", raised: 38 },
            { name: "Ghaziabad", raised: 75 },
            { name: "Greater Noida", raised: 100 },
            { name: "Gurgaon", raised: 23 },
            { name: "Manesar", raised: 100 },
            { name: "Noida", raised: 100 },
          ]}
          type="bar"
          showTarget={false}
          valueSuffix="%"
          showLegend={false}
        />

        <IssuesChart
          title="Malba (collected/target)"
          data={cityPercents.map(c => ({ name: c.city, raised: c.percent }))}
          type="bar"
          showTarget={false}
          valueSuffix="%"
          showLegend={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Issues Under 7 days"
          value="34%"
          variant="info"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
    </div>
  );
};

export default Performance;
