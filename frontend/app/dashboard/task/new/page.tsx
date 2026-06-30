"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tasksService } from "@/services/tasks.service";
import { TaskCreate } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import TaskForm from "@/components/features/dashboard/tasks/TaskForm";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date: string | null;
  }) => {
    try {
      setLoading(true);

      const taskData: TaskCreate = {
        title: data.title,
        description: data.description || undefined,
        status: data.status as any,
        priority: data.priority as any,
        due_date: data.due_date || null,
      };

      await tasksService.createTask(taskData);

      toast.success("Task created successfully! 🎉", {
        duration: 3000,
        action: {
          label: "View Tasks",
          onClick: () => router.push("/dashboard"),
        },
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Task</h1>
          <p className="text-muted-foreground mt-1">Create a new task</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Information</CardTitle>
          <CardDescription>
            Fill in the details to create a new task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleSubmit} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
