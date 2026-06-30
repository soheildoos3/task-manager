"use client";

import { useCallback, useEffect, useState } from "react";
import { tasksService } from "@/services/tasks.service";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import StatsCards from "@/components/features/dashboard/reports/StatsCards";
import StatusDistribution from "@/components/features/dashboard/reports/StatusDistribution";
import PriorityDistribution from "@/components/features/dashboard/reports/PriorityDistribution";
import RecentTasks from "@/components/features/dashboard/reports/RecentTasks";

export default function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    completionRate: 0,
    highPriorityTasks: 0,
    mediumPriorityTasks: 0,
    lowPriorityTasks: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
  });

  const calculateStats = useCallback((tasks: Task[]) => {
    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in_progress",
    ).length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const completionRate =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
    const mediumPriorityTasks = tasks.filter(
      (t) => t.priority === "medium",
    ).length;
    const lowPriorityTasks = tasks.filter((t) => t.priority === "low").length;

    const overdueTasks = tasks.filter((t) => {
      if (!t.due_date || t.status === "done") return false;
      return new Date(t.due_date) < new Date();
    }).length;

    const upcomingTasks = tasks.filter((t) => {
      if (!t.due_date || t.status === "done") return false;
      const dueDate = new Date(t.due_date);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    return {
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      completionRate,
      highPriorityTasks,
      mediumPriorityTasks,
      lowPriorityTasks,
      overdueTasks,
      upcomingTasks,
    };
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksService.getAllTasks();
      setTasks(data);
      setStats(calculateStats(data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Overview of task statistics and performance
        </p>
      </div>

      <StatsCards
        totalTasks={stats.totalTasks}
        completionRate={stats.completionRate}
        overdueTasks={stats.overdueTasks}
        upcomingTasks={stats.upcomingTasks}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatusDistribution
          todoTasks={stats.todoTasks}
          inProgressTasks={stats.inProgressTasks}
          doneTasks={stats.doneTasks}
          totalTasks={stats.totalTasks}
        />

        <PriorityDistribution
          highPriority={stats.highPriorityTasks}
          mediumPriority={stats.mediumPriorityTasks}
          lowPriority={stats.lowPriorityTasks}
          totalTasks={stats.totalTasks}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTasks tasks={tasks} />
        </CardContent>
      </Card>
    </div>
  );
}
