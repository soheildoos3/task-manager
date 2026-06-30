"use client";

import { useState, useEffect } from "react";
import { TaskStatus, TaskPriority, Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CalendarIcon,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Task;
  submitLabel?: string;
}

export default function TaskForm({
  onSubmit,
  isLoading = false,
  initialData,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    due_date: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || "",
        status: initialData.status,
        priority: initialData.priority,
        due_date: initialData.due_date?.split("T")[0] || "",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date || null,
    });

    if (!initialData) {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
      });
    }
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          disabled={isLoading}
          className={cn(errors.title && "border-destructive")}
          autoFocus
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description..."
          className="min-h-[120px] resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TaskStatus) =>
              setFormData({ ...formData, status: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo" className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-yellow-500" />
                <span>Todo</span>
              </SelectItem>
              <SelectItem
                value="in_progress"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-blue-500" />
                <span>In Progress</span>
              </SelectItem>
              <SelectItem value="done" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Done</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: TaskPriority) =>
              setFormData({ ...formData, priority: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low" className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-green-500" />
                <span>Low</span>
              </SelectItem>
              <SelectItem value="medium" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span>Medium</span>
              </SelectItem>
              <SelectItem value="high" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>High</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <div className="relative">
          <CalendarIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            id="due_date"
            name="due_date"
            type="date"
            className="pl-10"
            value={formData.due_date}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Leave empty if no due date
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {initialData ? "Updating..." : "Creating..."}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
