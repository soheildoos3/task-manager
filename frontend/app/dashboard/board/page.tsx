"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tasksService } from "@/services/tasks.service";
import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import TaskBoard from "@/components/features/dashboard/tasks/TaskBoard";

export default function BoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 12;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await tasksService.getTasks(params);

      setTasks(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
      );

      await tasksService.updateTask(taskId, { status });
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
      await fetchTasks();
      throw error;
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Board</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop tasks to update their status
          </p>
        </div>
        <Link href="/dashboard/task/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <TaskBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    </div>
  );
}
