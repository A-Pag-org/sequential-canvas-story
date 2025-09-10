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
      { name: "Category 1", raised: 5620 },
      { name: "Category 2", raised: 7886 },
      { name: "Category 3", raised: 6793 },
      { name: "Category 4", raised: 9876 },
      { name: "Category 5", raised: 7543 },
      { name: "Category 6", raised: 4365 },
      { name: "Category 7", raised: 867 },
      { name: "Category 8", raised: 987 },
      { name: "Category 9", raised: 432 },
      { name: "Category 10", raised: 10 },
    ],
    resolved: [7, 7886, 1678, 2349, 801, 4365, 667, 21, 132, 10]
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

      {/* Issues Chart for Selected City */}
      <IssuesChart
        title={`${selectedCity}: Issues Raised and Resolved`}
        data={chartData}
        type="composed"
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
