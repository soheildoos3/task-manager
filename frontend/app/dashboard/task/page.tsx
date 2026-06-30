"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tasksService } from "@/services/tasks.service";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import TaskFilters from "@/components/features/dashboard/tasks/TaskFilters";
import TaskCard from "@/components/features/dashboard/tasks/TaskCard";
import { PaginationButtons } from "@/components/features/dashboard/tasks/PaginationButtons";
import { useDebounce } from "use-debounce";

export default function TaskListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 9;

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

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
  }, [
    debouncedSearch,
    statusFilter,
    priorityFilter,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const currentPageParam = Number(params.get("page"));

    if (
      currentPageParam !== 1 &&
      (debouncedSearch || statusFilter || priorityFilter)
    ) {
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || loading) return;

      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [totalPages, loading, searchParams, router],
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, loading, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1 && !loading) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, loading, goToPage]);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {totalItems > 0
              ? `Viewing ${tasks.length} of ${totalItems} tasks`
              : "View and manage all your tasks"}
          </p>
        </div>
        <Link href="/dashboard/task/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {tasks.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-lg">No tasks found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {debouncedSearch || statusFilter || priorityFilter
              ? "Try adjusting your filters"
              : "Create your first task to get started"}
          </p>
          {!debouncedSearch && !statusFilter && !priorityFilter && (
            <Link href="/dashboard/task/new" className="mt-4">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  router.push(`/dashboard/task/${task.id}?edit=true`);
                }}
                onDelete={async (task) => {
                  if (
                    confirm(`Are you sure you want to delete "${task.title}"?`)
                  ) {
                    try {
                      await tasksService.deleteTask(task.id);
                      toast.success(
                        `Task "${task.title}" deleted successfully`,
                      );
                      await fetchTasks();
                    } catch (error) {
                      toast.error("Failed to delete task");
                    }
                  }
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={goToPreviousPage}
              onNext={goToNextPage}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
