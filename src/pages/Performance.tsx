import { MetricCard } from "@/components/MetricCard";
import { DataTable } from "@/components/DataTable";
import { Clock, Zap, Target } from "lucide-react";

// Sample performance data
const performanceTableData = [
  {
    id: 1,
    issueType: "Barren land to be greened",
    agency: "Urban Greening Dept",
    turnAroundTime: "6.2 days",
    fastestCity: "Noida",
    slowestCity: "Ghaziadabad",
    avgTimeTaken: "5.1 days",
  },
  {
    id: 2,
    issueType: "Broken Footpath / Divider",
    agency: "Public Works Dept",
    turnAroundTime: "4.8 days",
    fastestCity: "Delhi",
    slowestCity: "Faridabad",
    avgTimeTaken: "4.2 days",
  },
  {
    id: 3,
    issueType: "Burning of garbage, plastic, leaves, branches etc.",
    agency: "Sanitation Department",
    turnAroundTime: "2.1 days",
    fastestCity: "Gurgaon",
    slowestCity: "Manesar",
    avgTimeTaken: "2.7 days",
  },
  {
    id: 4,
    issueType: "Construction/ demolition activity without safeguards",
    agency: "Environment Control Board",
    turnAroundTime: "3.9 days",
    fastestCity: "Noida",
    slowestCity: "Greater Noida",
    avgTimeTaken: "4.0 days",
  },
  {
    id: 5,
    issueType: "Encroachment-Building Materials Dumped on Road",
    agency: "Traffic Police",
    turnAroundTime: "3.2 days",
    fastestCity: "Delhi",
    slowestCity: "Ghaziadabad",
    avgTimeTaken: "3.6 days",
  },
  {
    id: 6,
    issueType: "Garbage dumped on public land",
    agency: "Municipal Corporation",
    turnAroundTime: "2.8 days",
    fastestCity: "Noida",
    slowestCity: "Faridabad",
    avgTimeTaken: "3.1 days",
  },
  {
    id: 7,
    issueType: "Malba, bricks, bori, etc dumped on public land",
    agency: "Municipal Corporation",
    turnAroundTime: "3.4 days",
    fastestCity: "Gurgaon",
    slowestCity: "Manesar",
    avgTimeTaken: "3.7 days",
  },
  {
    id: 8,
    issueType: "Overflowing Dustbins",
    agency: "Sanitation Department",
    turnAroundTime: "1.6 days",
    fastestCity: "Noida",
    slowestCity: "Ghaziadabad",
    avgTimeTaken: "2.0 days",
  },
  {
    id: 9,
    issueType: "Pothole",
    agency: "Public Works Dept",
    turnAroundTime: "4.6 days",
    fastestCity: "Delhi",
    slowestCity: "Faridabad",
    avgTimeTaken: "4.1 days",
  },
  {
    id: 10,
    issueType: "Sand piled on roadsides + Mud/slit on roadside",
    agency: "Public Works Dept",
    turnAroundTime: "3.5 days",
    fastestCity: "Noida",
    slowestCity: "Greater Noida",
    avgTimeTaken: "3.9 days",
  },
  {
    id: 11,
    issueType: "Unpaved Road",
    agency: "Public Works Dept",
    turnAroundTime: "7.8 days",
    fastestCity: "Gurgaon",
    slowestCity: "Manesar",
    avgTimeTaken: "6.2 days",
  },
  {
    id: 12,
    issueType: "Unsurfaced Parking Lots",
    agency: "Urban Development Authority",
    turnAroundTime: "5.1 days",
    fastestCity: "Delhi",
    slowestCity: "Ghaziadabad",
    avgTimeTaken: "4.7 days",
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
    { key: "fastestCity", label: "Fastest City" },
    { key: "slowestCity", label: "Slowest City" },
    { key: "avgTimeTaken", label: "Avg. Time Taken" },
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
        eyeColumnKey="issueType"
        singleExpand={true}
      />
    </div>
  );
};

export default Performance;
