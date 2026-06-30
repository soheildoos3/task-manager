"use client";

import { useCallback, useEffect, useState } from "react";
import { tasksService } from "@/services/tasks.service";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CalendarHeader from "@/components/features/dashboard/calendar/CalendarHeader";
import CalendarGrid from "@/components/features/dashboard/calendar/CalendarGrid";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const lastDay = new Date(year, month + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, []);

  const getTasksForDate = useCallback(
    (date: Date) => {
      return tasks.filter((task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [tasks],
  );

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  const changeMonth = useCallback(
    (delta: number) => {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1),
      );
    },
    [currentDate],
  );

  if (loading) {
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
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View and manage tasks by due date
          </p>
        </div>
        <Link href="/dashboard/task/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            onToday={() => setCurrentDate(new Date())}
          />
        </CardHeader>
        <CardContent>
          <CalendarGrid
            days={getDaysInMonth(currentDate)}
            tasks={tasks}
            getTasksForDate={getTasksForDate}
            isToday={isToday}
          />
        </CardContent>
      </Card>
    </div>
  );
}
