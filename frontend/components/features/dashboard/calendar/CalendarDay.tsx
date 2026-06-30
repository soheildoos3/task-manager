"use client";

import Link from "next/link";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  isToday: boolean;
}

export default function CalendarDay({
  date,
  tasks,
  isToday,
}: CalendarDayProps) {
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div
      className={`min-h-[100px] rounded-lg border p-2 transition-colors ${
        isToday ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            isToday ? "text-primary" : "text-foreground"
          }`}
        >
          {date.getDate()}
        </span>
        {tasks.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        )}
      </div>
      <div className="mt-1 space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <Link
            key={task.id}
            href={`/dashboard/task/${task.id}`}
            className="hover:bg-muted block rounded px-1 py-0.5 text-xs"
          >
            <div className="flex items-center gap-1 truncate">
              <div
                className={`h-1.5 w-1.5 rounded-full ${getPriorityColor(task.priority)}`}
              />
              <span className="truncate">{task.title}</span>
            </div>
          </Link>
        ))}
        {tasks.length > 3 && (
          <span className="text-muted-foreground text-xs">
            +{tasks.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}
