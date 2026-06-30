"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface StatusDistributionProps {
  todoTasks?: number;
  inProgressTasks?: number;
  doneTasks?: number;
  totalTasks?: number;
}

export default function StatusDistribution({
  todoTasks = 0,
  inProgressTasks = 0,
  doneTasks = 0,
  totalTasks = 0,
}: StatusDistributionProps) {
  const data = useMemo(() => {
    const items = [
      {
        label: "Todo",
        value: todoTasks || 0,
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
      },
      {
        label: "In Progress",
        value: inProgressTasks || 0,
        color: "bg-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        textColor: "text-blue-700 dark:text-blue-400",
      },
      {
        label: "Done",
        value: doneTasks || 0,
        color: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        textColor: "text-green-700 dark:text-green-400",
      },
    ];

    const total = items.reduce((sum, item) => sum + item.value, 0);

    return items.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));
  }, [todoTasks, inProgressTasks, doneTasks]);

  const total = todoTasks + inProgressTasks + doneTasks;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No data to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={item.textColor}>{item.label}</span>
              <span className={`font-medium ${item.textColor}`}>
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="bg-secondary h-2 overflow-hidden rounded-full">
              <div
                className={`h-2 rounded-full ${item.color} transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
