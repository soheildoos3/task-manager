"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriorityBarChartProps {
  data: {
    low: number;
    medium: number;
    high: number;
  };
}

export default function PriorityBarChart({ data }: PriorityBarChartProps) {
  const chartData = [
    { name: "Low", value: data.low, color: "#22C55E" },
    { name: "Medium", value: data.medium, color: "#EAB308" },
    { name: "High", value: data.high, color: "#EF4444" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8">
          {chartData.map((entry, index) => (
            <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
