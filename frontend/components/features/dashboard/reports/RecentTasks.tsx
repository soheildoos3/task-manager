"use client";

import Link from "next/link";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useMemo } from "react";

interface RecentTasksProps {
  tasks: Task[];
  limit?: number;
}

export default function RecentTasks({ tasks, limit = 5 }: RecentTasksProps) {
  const recentTasks = useMemo(() => {
    return tasks
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, limit);
  }, [tasks, limit]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      todo: "secondary" as const,
      in_progress: "default" as const,
      done: "success" as const,
    };
    const labels = {
      todo: "Todo",
      in_progress: "In Progress",
      done: "Done",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center">No tasks found</p>;
  }

  return (
    <div className="space-y-2">
      {recentTasks.map((task) => (
        <Link
          key={task.id}
          href={`/dashboard/task/${task.id}`}
          className="hover:bg-muted flex items-center justify-between rounded-lg border p-3 transition-colors"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className={`h-2 w-2 flex-shrink-0 rounded-full ${getPriorityColor(task.priority)}`}
            />
            <span className="truncate font-medium">{task.title}</span>
            <div className="hidden sm:block">{getStatusBadge(task.status)}</div>
          </div>
          {task.due_date && (
            <span className="text-muted-foreground flex items-center gap-1 text-sm whitespace-nowrap">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
