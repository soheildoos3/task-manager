"use client";

import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const router = useRouter();

  const statusConfig = useMemo(() => {
    const configs = {
      todo: {
        label: "Todo",
        dotColor: "bg-yellow-500",
        badgeVariant: "outline" as const,
      },
      in_progress: {
        label: "In Progress",
        dotColor: "bg-blue-500",
        badgeVariant: "outline" as const,
      },
      done: {
        label: "Done",
        dotColor: "bg-green-500",
        badgeVariant: "default" as const,
      },
    };
    return configs[task.status] || configs.todo;
  }, [task.status]);

  const priorityConfig = useMemo(() => {
    const configs = {
      low: {
        label: "Low",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
      },
      medium: {
        label: "Medium",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      },
      high: {
        label: "High",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      },
    };
    return configs[task.priority] || configs.medium;
  }, [task.priority]);

  const formatDate = (date: string | null) => {
    if (!date) return "";
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task);
  };

  return (
    <Card className="group h-full transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/dashboard/task/${task.id}`} className="min-w-0 flex-1">
            <CardTitle className="hover:text-primary line-clamp-1 text-lg transition-colors">
              {task.title}
            </CardTitle>
          </Link>
          <div
            className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${statusConfig.dotColor}`}
            aria-label={`Status: ${statusConfig.label}`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusConfig.badgeVariant}>
            {statusConfig.label}
          </Badge>
          <Badge className={priorityConfig.className}>
            {priorityConfig.label}
          </Badge>
          {task.due_date && (
            <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit task</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
