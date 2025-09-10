import { MetricCard } from "@/components/MetricCard";
import { DataTable } from "@/components/DataTable";
import { Clock, Zap, Target } from "lucide-react";

// Sample performance data
const performanceTableData = [
  {
    id: 1,
    issueType: "Water Supply",
    city: "Delhi",
    agency: "Water Supply Board",
    turnAroundTime: "2.5 days",
  },
  {
    id: 2,
    issueType: "Road Maintenance", 
    city: "Mumbai",
    agency: "Public Works Dept",
    turnAroundTime: "5.2 days",
  },
  {
    id: 3,
    issueType: "Waste Management",
    city: "Bangalore",
    agency: "Municipal Corporation",
    turnAroundTime: "3.1 days",
  },
  {
    id: 4,
    issueType: "Traffic Management",
    city: "Chennai",
    agency: "Transport Authority",
    turnAroundTime: "1.8 days",
  },
  {
    id: 5,
    issueType: "Street Lighting",
    city: "Delhi",
    agency: "Electricity Board",
    turnAroundTime: "4.3 days",
  },
];

const Performance = () => {
  const performanceColumns = [
    {
      key: "srNo",
      label: "Sr.No.",
      render: (_: any, row: any) => (performanceTableData.findIndex(item => item.id === row.id) + 1)
    },
    { key: "issueType", label: "Issue Type" },
    { key: "city", label: "City" },
    { key: "agency", label: "Agency" },
    {
      key: "turnAroundTime",
      label: "Turn Around Time",
      render: (value: string) => (
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="City with Fastest Issue Resolution"
          value="Chennai"
          subtitle="City Name : 1.8 days avg"
          icon={Zap}
          variant="success"
        />
        <MetricCard
          title="City with Slowest Issue Resolution"
          value="Mumbai"  
          subtitle="City Name : 5.2 days avg"
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

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Issues Under 7 days"
          value="34%"
          variant="info"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Performance Details Table */}
      <DataTable
        title="Issue Resolution Performance Details"
        columns={performanceColumns}
        data={performanceTableData}
        eyeInCity={true}
      />
    </div>
  );
};

export default Performance;
