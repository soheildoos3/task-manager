"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { tasksService } from "@/services/tasks.service";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Edit, Trash2, Save, X } from "lucide-react";
import Link from "next/link";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "" as TaskStatus | "",
    priority: "" as TaskPriority | "",
    due_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getTask(Number(params.id));
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description || "",
        status: data.status,
        priority: data.priority,
        due_date: data.due_date || "",
      });
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    if (!formData.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }

    try {
      await tasksService.updateTask(task.id, {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status as TaskStatus,
        priority: formData.priority as TaskPriority,
        due_date: formData.due_date || null,
      });
      setIsEditing(false);
      setErrors({});
      fetchTask();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: "Error updating task" });
      }
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await tasksService.deleteTask(task.id);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
  const variants = {
    todo: "secondary",
    in_progress: "default",
    done: "outline",
  } as const;
  const labels = {
    todo: "Todo",
    in_progress: "In Progress",
    done: "Done",
  };
  return (
    <Badge 
      variant={variants[status as keyof typeof variants]}
      className={status === "done" ? "border-green-500 text-green-600 bg-green-50" : ""}
    >
      {labels[status as keyof typeof labels]}
    </Badge>
  );
};

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "outline",
      medium: "default",
      high: "destructive",
    } as const;
    const labels = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };
    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Task not found</p>
        <Link href="/dashboard">
          <Button variant="link" className="mt-2">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="flex-1 text-3xl font-bold">{task.title}</h1>
        <div className="flex gap-2">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <textarea
                    id="edit-description"
                    className="border-input bg-background min-h-[150px] w-full resize-none rounded-md border px-3 py-2 text-sm"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Task description..."
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {task.description || "No description provided for this task."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Task title..."
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-destructive text-sm">{errors.title}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: TaskStatus) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: TaskPriority) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-due_date">Due Date</Label>
                    <Input
                      id="edit-due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                    />
                  </div>
                  {errors.submit && (
                    <p className="text-destructive text-sm">{errors.submit}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          title: task.title,
                          description: task.description || "",
                          status: task.status,
                          priority: task.priority,
                          due_date: task.due_date || "",
                        });
                        setErrors({});
                      }}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpdate}
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Status
                    </p>
                    <div className="mt-1">{getStatusBadge(task.status)}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Priority
                    </p>
                    <div className="mt-1">
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Due Date
                    </p>
                    <p className="mt-1">{formatDate(task.due_date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Created
                    </p>
                    <p className="mt-1">{formatDate(task.created_at)}</p>
                  </div>
                  {task.updated_at && (
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">
                        Last Updated
                      </p>
                      <p className="mt-1">{formatDate(task.updated_at)}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task &quot;{task.title}&quot; and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Task"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
