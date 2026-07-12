import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { colors } from '../ui/tokens/colors';

// Generic data item format for all charts
export interface ChartDataPoint {
  name: string; // label on x-axis or category name
  [key: string]: string | number; // data value fields
}

// ==========================================
// 1. Line Chart Wrapper
// ==========================================
export interface LineChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colorsList?: string[];
  height?: number;
}

export const LineChartWrapper = ({
  data,
  dataKeys,
  colorsList = [colors.charts.indigo, colors.charts.emerald],
  height = 300,
}: LineChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.charts.grid.dark} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.charts.tooltip.bg.dark,
              borderColor: colors.charts.tooltip.border.dark,
              borderRadius: '6px',
            }}
            labelStyle={{ color: colors.brand.primary.dark, fontSize: 12, fontWeight: 'bold' }}
            itemStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, marginTop: 10 }} />
          {dataKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorsList[idx % colorsList.length]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==========================================
// 2. Area Chart Wrapper
// ==========================================
export interface AreaChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colorsList?: string[];
  height?: number;
}

export const AreaChartWrapper = ({
  data,
  dataKeys,
  colorsList = [colors.charts.emerald, colors.charts.violet],
  height = 300,
}: AreaChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {dataKeys.map((key, idx) => {
              const color = colorsList[idx % colorsList.length];
              return (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.charts.grid.dark} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.charts.tooltip.bg.dark,
              borderColor: colors.charts.tooltip.border.dark,
              borderRadius: '6px',
            }}
            labelStyle={{ color: colors.brand.primary.dark, fontSize: 12, fontWeight: 'bold' }}
            itemStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, marginTop: 10 }} />
          {dataKeys.map((key, idx) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colorsList[idx % colorsList.length]}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#grad-${key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==========================================
// 3. Bar Chart Wrapper
// ==========================================
export interface BarChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colorsList?: string[];
  height?: number;
}

export const BarChartWrapper = ({
  data,
  dataKeys,
  colorsList = [colors.charts.amber, colors.charts.indigo],
  height = 300,
}: BarChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.charts.grid.dark} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={colors.brand.secondary.dark}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.charts.tooltip.bg.dark,
              borderColor: colors.charts.tooltip.border.dark,
              borderRadius: '6px',
            }}
            labelStyle={{ color: colors.brand.primary.dark, fontSize: 12, fontWeight: 'bold' }}
            itemStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, marginTop: 10 }} />
          {dataKeys.map((key, idx) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colorsList[idx % colorsList.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==========================================
// 4. Pie Chart Wrapper
// ==========================================
export interface PieChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  colorsList?: string[];
  height?: number;
}

export const PieChartWrapper = ({
  data,
  dataKey,
  colorsList = [colors.charts.emerald, colors.charts.violet, colors.charts.amber, colors.charts.blue],
  height = 300,
}: PieChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorsList[index % colorsList.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.charts.tooltip.bg.dark,
              borderColor: colors.charts.tooltip.border.dark,
              borderRadius: '6px',
            }}
            itemStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, marginTop: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// ==========================================
// 5. Radar Chart Wrapper (ESG radar overlay)
// ==========================================
export interface RadarChartProps {
  data: ChartDataPoint[];
  dataKeys: string[];
  colorsList?: string[];
  height?: number;
}

export const RadarChartWrapper = ({
  data,
  dataKeys,
  colorsList = [colors.charts.violet],
  height = 300,
}: RadarChartProps) => {
  return (
    <div style={{ width: '100%', height }} className="flex justify-center">
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke={colors.charts.grid.dark} />
          <PolarAngleAxis dataKey="name" stroke={colors.brand.secondary.dark} fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={colors.brand.secondary.dark} fontSize={10} />
          {dataKeys.map((key, idx) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={colorsList[idx % colorsList.length]}
              fill={colorsList[idx % colorsList.length]}
              fillOpacity={0.25}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: colors.charts.tooltip.bg.dark,
              borderColor: colors.charts.tooltip.border.dark,
              borderRadius: '6px',
            }}
            itemStyle={{ fontSize: 11 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
export type ChartWrapperTypes = typeof LineChartWrapper | typeof AreaChartWrapper | typeof BarChartWrapper | typeof PieChartWrapper | typeof RadarChartWrapper;
