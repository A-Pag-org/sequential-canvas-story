import { IssuesChart } from "@/components/IssuesChart";
import { IssueStatCard } from "@/components/IssueStatCard";
import { MetricCard } from "@/components/MetricCard";
import { Trophy, ArrowDownCircle } from "lucide-react";

// Data for charts (Target vs Actual) as provided
const performanceByCity = [
  { name: "Baharudgarh", targetRaised: 9000, actualRaised: 7356, targetResolved: 8100, actualResolved: 2169 },
  { name: "Delhi",        targetRaised: 120000, actualRaised: 70550, targetResolved: 108000, actualResolved: 52984 },
  { name: "Faridabad",    targetRaised: 30000, actualRaised: 22161, targetResolved: 27000,  actualResolved: 17636 },
  { name: "Ghaziabad",    targetRaised: 45000, actualRaised: 30814, targetResolved: 40500,  actualResolved: 26505 },
  { name: "Greater Noida",targetRaised: 15000, actualRaised: 12705, targetResolved: 13500,  actualResolved: 9575 },
  { name: "Gurgaon",      targetRaised: 30000, actualRaised: 26169, targetResolved: 27000,  actualResolved: 17656 },
  { name: "Manesar",      targetRaised: 9000,  actualRaised: 9606,  targetResolved: 8100,   actualResolved: 7454 },
  { name: "Noida",        targetRaised: 21000, actualRaised: 17742, targetResolved: 18900,  actualResolved: 14253 },
];

const resolvedChartData = performanceByCity.map((c) => ({
  name: c.name,
  actualResolved: c.actualResolved,
  targetResolved: c.targetResolved,
  actualRaised: c.actualRaised,
}));

const totals = performanceByCity.reduce(
  (acc, c) => {
    acc.targetRaised += c.targetRaised;
    acc.actualRaised += c.actualRaised;
    acc.targetResolved += c.targetResolved;
    acc.actualResolved += c.actualResolved;
    return acc;
  },
  { targetRaised: 0, actualRaised: 0, targetResolved: 0, actualResolved: 0 }
);

const resolutionRates = [
  { name: "Baharudgarh", raised: 29 },
  { name: "Delhi", raised: 75 },
  { name: "Faridabad", raised: 80 },
  { name: "Ghaziabad", raised: 86 },
  { name: "Greater Noida", raised: 75 },
  { name: "Gurgaon", raised: 67 },
  { name: "Manesar", raised: 78 },
  { name: "Noida", raised: 93 },
];

const resolutionRatesSorted = [...resolutionRates].sort((a, b) => b.raised - a.raised);

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards - DSP style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <IssueStatCard
          title="Actual Issues"
          target={totals.actualRaised}
          actual={totals.actualResolved}
          variant="resolved"
          leftLabelText="Raised"
          rightLabelText="Resolved"
          subtitle="(Average Resolution Rate)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="City with Highest Resolution Rate"
          value="Noida"
          subtitle="93%"
          icon={Trophy}
          variant="success"
        />
        <MetricCard
          title="City with Lowest Resolution Rate"
          value="Baharudgarh"
          subtitle="29%"
          icon={ArrowDownCircle}
          variant="danger"
        />
      </div>

      {/* Issues Resolved Chart - Stacked with Line */}
      <IssuesChart
        title="Issue Status"
        data={resolvedChartData}
        type="stacked-line"
      />

      <IssuesChart
        title="Actual Resolution Rate by City"
        data={resolutionRates}
        showTarget={false}
        showLegend={false}
        valueSuffix="%"
        getBarFill={(entry) => {
          const v = Number((entry as any).raised) || 0;
          if (v > 90) return "hsl(var(--success))";
          if (v >= 80 && v <= 90) return "hsl(var(--warning))";
          return "hsl(var(--danger))";
        }}
      />

    </div>
  );
};

export default Home;
