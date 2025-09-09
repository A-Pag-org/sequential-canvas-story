import { MetricCard } from "@/components/MetricCard";
import { IssuesChart } from "@/components/IssuesChart";
import { TrendingUp, CheckCircle } from "lucide-react";

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

    </div>
  );
};

export default Home;
