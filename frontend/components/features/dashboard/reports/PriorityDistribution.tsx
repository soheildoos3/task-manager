"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface PriorityDistributionProps {
  highPriority?: number;
  mediumPriority?: number;
  lowPriority?: number;
  totalTasks?: number;
}

export default function PriorityDistribution({
  highPriority = 0,
  mediumPriority = 0,
  lowPriority = 0,
  totalTasks = 0,
}: PriorityDistributionProps) {
  const data = useMemo(() => {
    const items = [
      { 
        label: "High", 
        value: highPriority || 0, 
        color: "bg-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        textColor: "text-red-700 dark:text-red-400",
      },
      { 
        label: "Medium", 
        value: mediumPriority || 0, 
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        textColor: "text-yellow-700 dark:text-yellow-400",
      },
      { 
        label: "Low", 
        value: lowPriority || 0, 
        color: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        textColor: "text-green-700 dark:text-green-400",
      },
    ];

    const total = items.reduce((sum, item) => sum + item.value, 0);
    
    return items.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
    }));
  }, [highPriority, mediumPriority, lowPriority]);

  const total = highPriority + mediumPriority + lowPriority;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
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
        <CardTitle>Priority Distribution</CardTitle>
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
            <div className="bg-secondary h-2 rounded-full overflow-hidden">
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