import { IssuesChart } from "@/components/IssuesChart";
import { IssueStatCard } from "@/components/IssueStatCard";
import { MetricCard } from "@/components/MetricCard";
import { Clock, Zap, Target } from "lucide-react";

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
  target: c.targetResolved,
  raised: c.actualResolved,
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

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards - DSP style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <IssueStatCard
          title="Actual Issues"
          target={totals.actualRaised}
          actual={totals.actualResolved}
          variant="raised"
        />
        <IssueStatCard
          title="Issues Resolved"
          target={totals.targetResolved}
          actual={totals.actualResolved}
          variant="resolved"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="City with Fastest Issue Resolution"
          value="Noida"
          subtitle="Noida: 1.8 days avg"
          icon={Zap}
          variant="success"
        />
        <MetricCard
          title="City with Slowest Issue Resolution"
          value="Ghaziabad"
          subtitle="Ghaziabad: 5.2 days avg"
          icon={Clock}
          variant="danger"
        />
        <MetricCard
          title="Average Issue Resolution Time by City"
          value="3.4 days"
          subtitle="Avg. Time across all cities"
          icon={Target}
          variant="info"
        />
      </div>

      {/* Issues Resolved Chart */}
      <IssuesChart
        title="Issues Resolved - Target vs Actual (City-wise)"
        data={resolvedChartData}
        type="bar"
        showPercentOfTarget
      />

    </div>
  );
};

export default Home;
