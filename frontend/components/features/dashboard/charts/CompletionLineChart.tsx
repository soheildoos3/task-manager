"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompletionLineChartProps {
  data: {
    date: string;
    completed: number;
    created: number;
  }[];
}

export default function CompletionLineChart({
  data,
}: CompletionLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#22C55E"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="created"
          stroke="#3B82F6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}