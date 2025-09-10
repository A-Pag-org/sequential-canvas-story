import { MetricCard } from "@/components/MetricCard";
import { DataTable } from "@/components/DataTable";
import { IssuesChart } from "@/components/IssuesChart";
import { Activity, Clock, TrendingUp } from "lucide-react";

interface CityWiseProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

// Sample data for different cities
const cityData = {
  Delhi: {
    raised: [
      { name: "Barren land to be greened", raised: 5620 },
      { name: "Broken Footpath / Divider", raised: 7886 },
      { name: "Burning of garbage, plastic, leaves, branches etc.", raised: 6793 },
      { name: "Construction/ demolition activity without safeguards", raised: 9876 },
      { name: "Encroachment-Building Materials Dumped on Road", raised: 7543 },
      { name: "Garbage dumped on public land", raised: 4365 },
      { name: "Malba, bricks, bori, etc dumped on public land", raised: 867 },
      { name: "Overflowing Dustbins", raised: 987 },
      { name: "Pothole", raised: 432 },
      { name: "Sand piled on roadsides + Mud/slit on roadside", raised: 410 },
      { name: "Unpaved Road", raised: 296 },
      { name: "Unsurfaced Parking Lots", raised: 188 },
    ],
    resolved: [7, 7886, 1678, 2349, 801, 4365, 667, 21, 132, 54, 37, 23]
  }
};

const agencyTableData = [
  { id: 1, agency: "Municipal Corporation", issuesRaised: 456, issueResolved: 398 },
  { id: 2, agency: "Public Works Department", issuesRaised: 234, issueResolved: 189 },
  { id: 3, agency: "Water Supply Board", issuesRaised: 189, issueResolved: 156 },
  { id: 4, agency: "Transport Authority", issuesRaised: 145, issueResolved: 132 },
];

const CityWise = ({ selectedCity }: CityWiseProps) => {
  // Process data for the chart
  const chartData = cityData.Delhi.raised.map((item, index) => ({
    ...item,
    resolved: cityData.Delhi.resolved[index] || 0,
  }));

  const agencyColumns = [
    { 
      key: "srNo", 
      label: "Sr.No.", 
      render: (_: any, row: any, index?: number) => (agencyTableData.findIndex(item => item.id === row.id) + 1)
    },
    { key: "agency", label: "Agency" },
    { key: "issuesRaised", label: "Issues Raised", render: (value: number) => value.toLocaleString() },
    { key: "issueResolved", label: "Issue Resolved", render: (value: number) => value.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      {/* Agency Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Agency"
          value="8"
          subtitle="Issues raised Target Vs Actual : 92%"
          icon={Activity}
          variant="warning"
        />
        <MetricCard
          title="Sluggish Agency"
          value="3"
          subtitle="Issue Resolved Target Vs Actual : 67%"
          icon={Clock}
          variant="danger"
        />
        <MetricCard
          title="Top Performer"
          value="Municipal Corp"
          subtitle="Avg. Issues Resolved Target Vs Actual : 96%"
          icon={TrendingUp}
          variant="info"
        />
      </div>

      {/* Issues Charts for Selected City (bar charts with all issue types visible) */}
      <IssuesChart
        title={`${selectedCity}: Issues Raised by Issue Type`}
        data={chartData.map(d => ({ name: d.name, raised: d.raised }))}
        type="bar"
      />

      <IssuesChart
        title={`${selectedCity}: Issues Resolved by Issue Type`}
        data={chartData.map(d => ({ name: d.name, raised: d.resolved }))}
        type="bar"
      />

      {/* Agency Performance Table */}
      <DataTable
        title="Agency Performance Details"
        columns={agencyColumns}
        data={agencyTableData}
        expandable={true}
      />
    </div>
  );
};

export default CityWise;
