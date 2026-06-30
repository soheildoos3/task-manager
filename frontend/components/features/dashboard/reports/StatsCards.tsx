"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, Calendar, ListTodo } from "lucide-react";

interface StatsCardsProps {
  totalTasks: number;
  completionRate: number;
  overdueTasks: number;
  upcomingTasks: number;
}

export default function StatsCards({
  totalTasks,
  completionRate,
  overdueTasks,
  upcomingTasks,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: <ListTodo className="text-muted-foreground h-4 w-4" />,
      color: "text-foreground",
      bgColor: "bg-muted/50",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      color:
        completionRate > 70
          ? "text-green-600"
          : completionRate > 40
            ? "text-yellow-600"
            : "text-red-600",
      bgColor:
        completionRate > 70
          ? "bg-green-50 dark:bg-green-950/20"
          : completionRate > 40
            ? "bg-yellow-50 dark:bg-yellow-950/20"
            : "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: <AlertCircle className="h-4 w-4" />,
      color: overdueTasks > 0 ? "text-red-600" : "text-green-600",
      bgColor:
        overdueTasks > 0
          ? "bg-red-50 dark:bg-red-950/20"
          : "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Upcoming (7 days)",
      value: upcomingTasks,
      icon: <Calendar className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={stat.bgColor}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground flex items-center justify-between text-sm font-medium">
              {stat.title}
              {stat.icon}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
