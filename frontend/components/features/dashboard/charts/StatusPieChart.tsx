"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusPieChartProps {
  data: {
    todo: number;
    in_progress: number;
    done: number;
  };
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const chartData = [
    { name: "Todo", value: data.todo, color: "#EAB308" },
    { name: "In Progress", value: data.in_progress, color: "#3B82F6" },
    { name: "Done", value: data.done, color: "#22C55E" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
