import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { StatCard, ESGScoreCard } from '../../../components/cards/StatCard';
import { DataTable, Column } from '../../../components/tables/DataTable';
import {
  LineChartWrapper,
  BarChartWrapper,
  AreaChartWrapper,
  ChartDataPoint,
} from '../../../components/charts/ChartWrappers';
import { LeaderboardWidget } from '../components/LeaderboardWidget';
import { Award, Leaf, Users, ShieldAlert, RefreshCcw } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';

// React Query Custom hooks imports
import { useDashboard, useDepartmentScores, useEmployees } from '../hooks/useDashboard';
import { useCarbonTransactions } from '../../carbon/hooks/useCarbon';
import { useComplianceIssues } from '../../governance/hooks/useGovernance';

// Interfaces for tables mappings
import { CarbonTransaction } from '../../../models/carbon';
import { ComplianceIssue } from '../../../models/governance';

export const DashboardPage = () => {
  // Query server states via hooks
  const { data: stats, isLoading: isStatsLoading, isError: isStatsError, refetch: refetchStats } = useDashboard();
  const { data: deptScores = [], isLoading: isDeptsLoading, isError: isDeptsError } = useDepartmentScores();
  const { data: employees = [], isLoading: isEmpLoading, isError: isEmpError } = useEmployees();
  const { data: recentTxs = [], isLoading: isTxsLoading, isError: isTxsError } = useCarbonTransactions();
  const { data: complianceIssues = [], isLoading: isComplianceLoading, isError: isComplianceError } = useComplianceIssues();

  // Retry triggering handler
  const handleReload = () => {
    refetchStats();
  };

  // Loading skeleton block page
  if (isStatsLoading || isDeptsLoading || isEmpLoading) {
    return (
      <PageContainer>
        <div className="flex justify-between items-center border-b border-border pb-5 animate-pulse">
          <div className="space-y-2 w-1/3">
            <div className="h-6 bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-zinc-800 rounded w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-32 bg-zinc-900 border border-border rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-zinc-900 border border-border rounded-lg animate-pulse" />
      </PageContainer>
    );
  }

  // Global error fallback screen
  if (isStatsError || isDeptsError || isEmpError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-red-500/30 rounded-lg bg-red-500/5 gap-4">
          <ShieldAlert className="h-10 w-10 text-red-500" />
          <h3 className="font-bold text-base text-red-500 uppercase tracking-wider">Failed to Load Dashboard</h3>
          <p className="text-xs text-zinc-400 max-w-md text-center">
            We encountered a network timeout syncing ESG scores weights. Verify your network config.
          </p>
          <Button variant="outline" size="sm" onClick={handleReload} leftIcon={<RefreshCcw className="h-4 w-4" />}>
            Retry Dashboard Sync
          </Button>
        </div>
      </PageContainer>
    );
  }

  // Fallback defaults
  const overall = stats?.overallScore ?? 0;
  const envScore = stats?.environmentalScore ?? 0;
  const socScore = stats?.socialScore ?? 0;
  const govScore = stats?.governanceScore ?? 0;
  const weights = stats?.weights ?? { environmental: 0.4, social: 0.3, governance: 0.3 };
  const ytdEmissions = stats?.carbonEmissionYtd ?? 0;
  const targetEmissions = stats?.carbonEmissionTarget ?? 15.0;
  const delta = stats?.scoreDelta ?? 0;

  // Chart datasets mapping
  const trendData: ChartDataPoint[] = [
    { name: 'Jan', Rating: 72.0 },
    { name: 'Feb', Rating: 73.5 },
    { name: 'Mar', Rating: 74.2 },
    { name: 'Apr', Rating: 75.8 },
    { name: 'May', Rating: 76.4 },
    { name: 'Jun', Rating: Number(overall.toFixed(1)) },
  ];

  const deptScoresData: ChartDataPoint[] = deptScores.slice(0, 5).map((dept) => ({
    name: dept.departmentName,
    Environmental: dept.environmentalScore,
    Social: dept.socialScore,
    Governance: dept.governanceScore,
  }));

  const carbonChartData: ChartDataPoint[] = [
    { name: 'Q1-Emissions', Ytd: Number((ytdEmissions * 0.4).toFixed(1)), Target: Number((targetEmissions * 0.4).toFixed(1)) },
    { name: 'Q2-Emissions', Ytd: Number((ytdEmissions * 0.7).toFixed(1)), Target: Number((targetEmissions * 0.7).toFixed(1)) },
    { name: 'Q3-Emissions', Ytd: Number(ytdEmissions.toFixed(1)), Target: Number(targetEmissions.toFixed(1)) },
  ];

  // Table columns configurations
  const carbonColumns: Column<CarbonTransaction>[] = [
    { header: 'Date', accessor: (item) => new Date(item.date).toLocaleDateString() },
    { header: 'Source', accessor: 'source' },
    { header: 'Activity', accessor: (item) => `${item.activityValue} ${item.unit}` },
    { header: 'Factor (Factor Value)', accessor: (item) => `${item.emissionFactor.name} (${item.emissionFactor.factor})` },
    { header: 'Emissions', accessor: (item) => `${item.calculatedEmissions.toLocaleString()} kg CO2e` },
  ];

  const complianceColumns: Column<ComplianceIssue>[] = [
    { header: 'Raised', accessor: (item) => new Date(item.dateRaised).toLocaleDateString() },
    { header: 'Violation Detail', accessor: 'title' },
    { header: 'Owner', accessor: 'ownerName' },
    { header: 'Severity', accessor: (item) => (
        <Badge variant={item.severity === 'critical' || item.severity === 'high' ? 'error' : 'warning'} size="sm">
          {item.severity}
        </Badge>
      )
    },
    { header: 'Status', accessor: (item) => (
        <Badge variant={item.status === 'resolved' ? 'success' : 'outline'} size="sm">
          {item.status}
        </Badge>
      )
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Real-time aggregation sheet of environmental logs, social scores, and compliance metrics."
      />

      {/* Main Weighted ESG ratings block */}
      <ESGScoreCard
        overallScore={overall}
        environmentalScore={envScore}
        socialScore={socScore}
        governanceScore={govScore}
        weights={weights}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall ESG Score"
          value={overall.toFixed(1)}
          icon={<Award className="h-5 w-5 text-indigo-400" />}
          trend={{ value: delta, type: delta >= 0 ? 'positive' : 'negative' }}
          subtext="vs last quarter"
        />
        <StatCard
          title="Carbon Emissions YTD"
          value={`${ytdEmissions} t`}
          icon={<Leaf className="h-5 w-5 text-emerald-400" />}
          trend={{ value: 3.2, type: 'negative' }} // Decreasing emissions is positive
          subtext={`Target limits: ${targetEmissions} t`}
        />
        <StatCard
          title="Active Challenges"
          value={stats?.activeChallengesCount ?? 0}
          icon={<Users className="h-5 w-5 text-violet-400" />}
          subtext="challenges enrolled"
        />
        <StatCard
          title="Compliance Open Tickets"
          value={stats?.openComplianceIssuesCount ?? 0}
          icon={<ShieldAlert className="h-5 w-5 text-amber-400" />}
          subtext="issues pending resolution"
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Trend line chart */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Overall ESG Rating Trend</h3>
          <LineChartWrapper data={trendData} dataKeys={['Rating']} />
        </div>

        {/* Pillar ratings comparatives bar chart */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Departmental Pillar Ratings</h3>
          <BarChartWrapper data={deptScoresData} dataKeys={['Environmental', 'Social', 'Governance']} />
        </div>

        {/* Carbon Area emissions chart */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Scope Emissions (Actual vs Target Target)</h3>
          <AreaChartWrapper data={carbonChartData} dataKeys={['Ytd', 'Target']} />
        </div>

        {/* Employee Leaderboard Card */}
        <LeaderboardWidget employees={employees} isLoading={isEmpLoading} isError={isEmpError} />
      </div>

      {/* Tables ledger section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Carbon Ledger Table */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Carbon Transactions</h3>
          <DataTable
            data={recentTxs.slice(0, 5)}
            columns={carbonColumns}
            rowKey={(item) => item.id}
            isLoading={isTxsLoading}
            isError={isTxsError}
            emptyMessage="No recent carbon transactions logged"
          />
        </div>

        {/* Compliance issues table */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Governance breach Alerts</h3>
          <DataTable
            data={complianceIssues.slice(0, 5)}
            columns={complianceColumns}
            rowKey={(item) => item.id}
            isLoading={isComplianceLoading}
            isError={isComplianceError}
            emptyMessage="No compliance tickets logged"
          />
        </div>
      </div>
    </PageContainer>
  );
};
export default DashboardPage;
