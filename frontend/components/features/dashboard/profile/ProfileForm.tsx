"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Loader2 } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    full_name: string;
    email: string;
  };
  onSubmit: (data: { full_name: string; email: string }) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  isLoading,
}: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setIsEditing(false);
      setErrors({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: "Error updating profile" });
      }
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground w-24 text-sm font-medium">
            Full Name
          </div>
          <div>{initialData.full_name || "Not set"}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground w-24 text-sm font-medium">
            Email
          </div>
          <div>{initialData.email}</div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          placeholder="Enter your full name"
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="text-destructive text-sm">{errors.full_name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email}</p>
        )}
      </div>
      {errors.submit && (
        <p className="text-destructive text-sm">{errors.submit}</p>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditing(false);
            setFormData(initialData);
            setErrors({});
          }}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
