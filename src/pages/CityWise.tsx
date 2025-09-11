import { MetricCard } from "@/components/MetricCard";
import { DataTable } from "@/components/DataTable";
import { IssuesChart } from "@/components/IssuesChart";
import { Activity, Clock, TrendingUp } from "lucide-react";

interface CityWiseProps {
  activeModule: string;
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

type AgencyRow = { id: number; agency: string; issuesRaised: number; issueResolved: number };

const agenciesByCity: Record<string, AgencyRow[]> = {
  Delhi: [
    { id: 1, agency: "CPWD", issuesRaised: 820, issueResolved: 710 },
    { id: 2, agency: "DDA", issuesRaised: 640, issueResolved: 522 },
    { id: 3, agency: "DJB", issuesRaised: 580, issueResolved: 498 },
    { id: 4, agency: "DMRC", issuesRaised: 310, issueResolved: 274 },
    { id: 5, agency: "DSIIDC", issuesRaised: 260, issueResolved: 221 },
    { id: 6, agency: "DUSIB", issuesRaised: 205, issueResolved: 168 },
    { id: 7, agency: "I & FC", issuesRaised: 180, issueResolved: 151 },
    { id: 8, agency: "MCD", issuesRaised: 940, issueResolved: 812 },
    { id: 9, agency: "NCRTC", issuesRaised: 120, issueResolved: 102 },
    { id: 10, agency: "NHAI", issuesRaised: 150, issueResolved: 129 },
    { id: 11, agency: "PWD", issuesRaised: 770, issueResolved: 655 },
    { id: 12, agency: "Railways", issuesRaised: 210, issueResolved: 174 },
  ],
  Faridabad: [
    { id: 1, agency: "FMC", issuesRaised: 430, issueResolved: 362 },
  ],
  Ghaziabad: [
    { id: 1, agency: "GMC", issuesRaised: 520, issueResolved: 441 },
  ],
  "Greater Noida": [
    { id: 1, agency: "GNIDA", issuesRaised: 315, issueResolved: 268 },
  ],
  Gurgaon: [
    { id: 1, agency: "GMC", issuesRaised: 580, issueResolved: 476 },
  ],
  Manesar: [
    { id: 1, agency: "-", issuesRaised: 0, issueResolved: 0 },
  ],
  Noida: [
    { id: 1, agency: "NA", issuesRaised: 0, issueResolved: 0 },
  ],
  Bahadurghar: [
    { id: 1, agency: "NA", issuesRaised: 0, issueResolved: 0 },
  ],
};

const CityWise = ({ activeModule, selectedCity }: CityWiseProps) => {
  // Process data for the chart
  const chartData = cityData.Delhi.raised.map((item, index) => ({
    ...item,
    resolved: cityData.Delhi.resolved[index] || 0,
  }));

  const agencyTableData: AgencyRow[] = agenciesByCity[selectedCity] || [];

  const agencyColumns = [
    {
      key: "srNo",
      label: "Sr.No.",
      render: (_: any, row: any) => (agencyTableData.findIndex(item => item.id === row.id) + 1)
    },
    { key: "agency", label: "Agency" },
    { key: "issuesRaised", label: "Issues Raised", render: (value: number) => value.toLocaleString() },
    { key: "issueResolved", label: "Issue Resolved", render: (value: number) => value.toLocaleString() },
  ];

  if (activeModule === "MRS") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Target SCC to be set up" value={163} variant="info" />
          <MetricCard title="Number of SCC set up so far" value={140} variant="success" />
          <MetricCard title="Number of SCC with dust mitigation systems" value={31} variant="warning" />
          <MetricCard title="Number of active SCC (>0 malba intake/month)" value={104} variant="info" />
          <MetricCard title="Number of geotagged SCC" value={65} variant="info" />
        </div>
      </div>
    );
  }

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
