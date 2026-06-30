"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Calendar,
  Circle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { PaginationButtons } from "./PaginationButtons";

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: number, status: TaskStatus) => Promise<void>;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}

const statusColumns: {
  id: TaskStatus;
  title: string;
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-yellow-500",
    icon: <Circle className="h-4 w-4 text-yellow-500" />,
  },
  {
    id: "in_progress",
    title: "In Progress",
    color: "bg-blue-500",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-500",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  },
];

export default function TaskBoard({
  tasks,
  onStatusChange,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
}: TaskBoardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks],
  );

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-red-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as TaskStatus;

    try {
      setUpdatingTaskId(taskId);
      await onStatusChange(taskId, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const goToPreviousPage = () => {
    if (onPageChange && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (onPageChange && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Plus className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">No tasks yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Get started by creating your first task
          </p>
          <Link href="/dashboard/task/new">
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {totalItems > 0
            ? `${totalItems} task${totalItems > 1 ? "s" : ""} in total`
            : `${tasks.length} task${tasks.length > 1 ? "s" : ""}`}
        </p>
        {isLoading && tasks.length > 0 && (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div key={column.id} className="min-w-0">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {column.icon}
                        <CardTitle className="text-sm font-medium">
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="ml-1">
                          {columnTasks.length}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "min-h-[200px] space-y-2 rounded-lg p-2 transition-colors duration-200",
                            snapshot.isDraggingOver &&
                              "bg-muted/50 ring-primary/20 ring-2",
                          )}
                        >
                          {columnTasks.length === 0 &&
                            !snapshot.isDraggingOver && (
                              <div className="text-muted-foreground flex h-32 flex-col items-center justify-center text-center">
                                <p className="text-sm">Empty</p>
                              </div>
                            )}
                          {columnTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={String(task.id)}
                              index={index}
                              isDragDisabled={
                                isLoading || updatingTaskId === task.id
                              }
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-card rounded-lg border p-3 shadow-sm transition-shadow duration-200 hover:shadow-md",
                                    snapshot.isDragging &&
                                      "ring-primary shadow-lg ring-2",
                                    updatingTaskId === task.id && "opacity-50",
                                  )}
                                >
                                  {updatingTaskId === task.id && (
                                    <div className="mb-2 flex items-center gap-2">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      <span className="text-muted-foreground text-xs">
                                        Updating...
                                      </span>
                                    </div>
                                  )}

                                  <Link
                                    href={`/dashboard/task/${task.id}`}
                                    className="block"
                                  >
                                    <p className="hover:text-primary line-clamp-2 text-sm font-medium transition-colors">
                                      {task.title}
                                    </p>
                                    {task.description && (
                                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                        {task.description}
                                      </p>
                                    )}
                                  </Link>

                                  <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1">
                                      <div
                                        className={cn(
                                          "h-2 w-2 rounded-full",
                                          getPriorityColor(task.priority),
                                        )}
                                      />
                                      <span className="text-muted-foreground text-xs capitalize">
                                        {getPriorityLabel(task.priority)}
                                      </span>
                                    </div>
                                    {task.due_date && (
                                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(task.due_date)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {onPageChange && totalPages > 1 && (
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
