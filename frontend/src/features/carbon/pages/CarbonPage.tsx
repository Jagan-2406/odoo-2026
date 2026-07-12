import React, { useState } from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { StatCard, MetricCard } from '../../../components/cards/StatCard';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { DataTable, Column } from '../../../components/tables/DataTable';
import {
  AreaChartWrapper,
  PieChartWrapper,
  BarChartWrapper,
  ChartDataPoint,
} from '../../../components/charts/ChartWrappers';
import { CarbonLogForm } from '../forms/CarbonLogForm';
import { Leaf, Plus, RefreshCcw, LayoutDashboard, FileSpreadsheet, Scale, Target } from 'lucide-react';
import { useCarbonTransactions, useEmissionFactors, useEnvironmentalGoals } from '../hooks/useCarbon';
import { CarbonTransaction, EmissionFactor, EnvironmentalGoal } from '../../../models/carbon';

export const CarbonPage = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'factors' | 'goals'>('dashboard');
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);

  // Load backend server data through hooks
  const { data: txs = [], isLoading: isTxsLoading, isError: isTxsError, refetch: refetchTxs } = useCarbonTransactions();
  const { data: factors = [], isLoading: isFactorsLoading, isError: isFactorsError } = useEmissionFactors();
  const { data: goals = [], isLoading: isGoalsLoading, isError: isGoalsError } = useEnvironmentalGoals();

  const handleRetry = () => {
    refetchTxs();
  };

  // 1. Calculate aggregated parameters inside mock views (simulating server state responses)
  const totalEmissions = txs.reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const scope1 = txs.filter((t) => t.source === 'fleet' || t.source === 'manufacturing').reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const scope2 = txs.filter((t) => t.source === 'purchase').reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const scope3 = txs.filter((t) => t.source === 'expense').reduce((acc, t) => acc + t.calculatedEmissions, 0);

  // 2. Chart Mappings
  const sourceDistributionData: ChartDataPoint[] = [
    { name: 'Scope 1 Direct', value: Number((scope1 / 1000).toFixed(1)) },
    { name: 'Scope 2 Indirect', value: Number((scope2 / 1000).toFixed(1)) },
    { name: 'Scope 3 Business', value: Number((scope3 / 1000).toFixed(1)) },
  ];

  const targetVsActualData: ChartDataPoint[] = goals.map((g) => ({
    name: g.name.substring(0, 15) + '...',
    Target: Number((g.targetValue / 1000).toFixed(1)),
    Actual: Number((g.currentValue / 1000).toFixed(1)),
  }));

  // 3. DataTable Columns Setup
  const logColumns: Column<CarbonTransaction>[] = [
    { header: 'Date', accessor: (item) => new Date(item.date).toLocaleDateString() },
    { header: 'Source Scope', accessor: 'source' },
    { header: 'Quantity', accessor: (item) => `${item.activityValue} ${item.unit}` },
    { header: 'Reference Factor', accessor: (item) => item.emissionFactor.name },
    { header: 'Calculated Emissions', accessor: (item) => `${item.calculatedEmissions.toLocaleString()} kg CO2e` },
  ];

  const factorColumns: Column<EmissionFactor>[] = [
    { header: 'Factor Name', accessor: 'name' },
    { header: 'Coefficient', accessor: (item) => `${item.factor} kg CO2e` },
    { header: 'Unit of Measure', accessor: 'unit' },
    { header: 'Status', accessor: (item) => <Badge variant={item.status === 'active' ? 'success' : 'outline'}>{item.status}</Badge> },
  ];

  const goalColumns: Column<EnvironmentalGoal>[] = [
    { header: 'Goal Target', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Progress Status', accessor: (item) => (
        <div className="w-48 space-y-1">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min((item.currentValue / item.targetValue) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>{Math.round((item.currentValue / item.targetValue) * 100)}%</span>
            <span>Target: {item.targetValue.toLocaleString()} {item.unit}</span>
          </div>
        </div>
      )
    },
    { header: 'Deadline', accessor: (item) => new Date(item.targetDate).toLocaleDateString() },
    { header: 'Status', accessor: (item) => (
        <Badge variant={item.status === 'achieved' ? 'success' : item.status === 'failed' ? 'error' : 'warning'}>
          {item.status}
        </Badge>
      )
    },
  ];

  // Tab trigger list
  const tabs = [
    { id: 'dashboard', label: 'Carbon Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'logs', label: 'Logs Ledger', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: 'factors', label: 'Factors Catalog', icon: <Scale className="h-4 w-4" /> },
    { id: 'goals', label: 'Targets & Goals', icon: <Target className="h-4 w-4" /> },
  ] as const;

  return (
    <PageContainer>
      <PageHeader
        title="Carbon Accounting Ledger"
        description="Monitor Scope 1, 2, and 3 emissions logs, review factors tables, and track compliance goals."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsLogFormOpen(true)}
          >
            Log Emissions
          </Button>
        }
      />

      {/* View switching Tabs */}
      <div className="flex border-b border-border gap-1 select-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Views Viewport */}
      {isTxsLoading || isFactorsLoading || isGoalsLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 border border-border rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-zinc-900 border border-border rounded-lg" />
        </div>
      ) : isTxsError || isFactorsError || isGoalsError ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-red-500/30 rounded-lg bg-red-500/5 gap-4">
          <Leaf className="h-10 w-10 text-red-500" />
          <h3 className="font-bold text-base text-red-500 uppercase tracking-wider">Failed to Load Carbon Logs</h3>
          <p className="text-xs text-zinc-400 max-w-md text-center">
            The platform was unable to fetch environmental records. Please check your network.
          </p>
          <Button variant="outline" size="sm" onClick={handleRetry} leftIcon={<RefreshCcw className="h-4 w-4" />}>
            Retry Data Sync
          </Button>
        </div>
      ) : (
        <>
          {/* TAB 1: Carbon Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Emissions YTD"
                  value={`${(totalEmissions / 1000).toFixed(1)} t CO2e`}
                  icon={<Leaf className="h-5 w-5 text-emerald-400" />}
                  trend={{ value: 4.8, type: 'negative' }}
                  subtext="decrease vs target"
                />
                <StatCard
                  title="Scope 1 Direct"
                  value={`${(scope1 / 1000).toFixed(1)} t`}
                  icon={<Badge variant="outline">Scope 1</Badge>}
                  subtext="Fleet & Manufacturing"
                />
                <StatCard
                  title="Scope 2 Indirect"
                  value={`${(scope2 / 1000).toFixed(1)} t`}
                  icon={<Badge variant="outline">Scope 2</Badge>}
                  subtext="Purchased Electricity"
                />
                <StatCard
                  title="Scope 3 Travel"
                  value={`${(scope3 / 1000).toFixed(1)} t`}
                  icon={<Badge variant="outline">Scope 3</Badge>}
                  subtext="Employee Commute/Flights"
                />
              </div>

              {/* Chart panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-card border border-border rounded-lg space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Target vs Actual Goals (metric tons)</h3>
                  <BarChartWrapper data={targetVsActualData} dataKeys={['Target', 'Actual']} />
                </div>
                <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Emissions Scope Breakdown</h3>
                  <PieChartWrapper data={sourceDistributionData} dataKey="value" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Logs Ledger */}
          {activeTab === 'logs' && (
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Historical Transactions Ledger</h3>
              <DataTable
                data={txs}
                columns={logColumns}
                searchKey="source"
                searchPlaceholder="Search by source (e.g. fleet, purchase)..."
                rowKey={(item) => item.id}
                enableExport
              />
            </div>
          )}

          {/* TAB 3: Factors Catalog */}
          {activeTab === 'factors' && (
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Reference Emission Coefficients</h3>
              <DataTable
                data={factors}
                columns={factorColumns}
                searchKey="name"
                searchPlaceholder="Search factor name (e.g. Diesel, Electricity)..."
                rowKey={(item) => item.id}
                enableExport={false}
              />
            </div>
          )}

          {/* TAB 4: Targets & Goals */}
          {activeTab === 'goals' && (
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Active Environmental Targets</h3>
              <DataTable
                data={goals}
                columns={goalColumns}
                searchKey="name"
                searchPlaceholder="Search targets..."
                rowKey={(item) => item.id}
                enableExport={false}
              />
            </div>
          )}
        </>
      )}

      {/* Log modal form */}
      <CarbonLogForm isOpen={isLogFormOpen} onClose={() => setIsLogFormOpen(false)} />
    </PageContainer>
  );
};
export default CarbonPage;
