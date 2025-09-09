import { MetricCard } from "@/components/MetricCard";
import { IssuesChart } from "@/components/IssuesChart";
import { TrendingUp, TrendingDown, Target, CheckCircle } from "lucide-react";

// Sample data based on the dashboard images
const cityData = [
  { name: "Delhi", target: 100, raised: 90, resolved: 78 },
  { name: "Gurugram", target: 100, raised: 83, resolved: 71 },
  { name: "Noida", target: 100, raised: 78, resolved: 65 },
  { name: "Faridabad", target: 100, raised: 67, resolved: 58 },
];

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Issues Raised"
          value="1,247"
          subtitle="Target Vs Actual: 89%"
          icon={TrendingUp}
          variant="warning"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Issues Resolved"
          value="982"
          subtitle="Target Vs Actual: 94%"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Chart */}
      <IssuesChart
        title="Issues Raised - Target vs Actual (City-wise)"
        data={cityData}
        type="bar"
      />

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Cities"
          value="4"
          icon={Target}
          variant="info"
        />
        <MetricCard
          title="Resolution Rate"
          value="78.8%"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Pending Issues"
          value="265"
          icon={TrendingDown}
          variant="danger"
          trend={{ value: -3, isPositive: false }}
        />
        <MetricCard
          title="Avg Resolution Time"
          value="4.2 days"
          icon={Target}
          variant="info"
        />
      </div>
    </div>
  );
};

export default Home;