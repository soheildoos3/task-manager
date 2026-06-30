"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ChangePasswordFormProps {
  onSubmit: (data: {
    old_password: string;
    new_password: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function ChangePasswordForm({
  onSubmit,
  isLoading,
}: ChangePasswordFormProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      return;
    }

    try {
      await onSubmit({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });
      setIsChanging(false);
      setFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setErrors({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ submit: "Error changing password" });
      }
    }
  };

  if (!isChanging) {
    return (
      <div>
        <p className="text-muted-foreground text-sm">
          Password is securely stored. Click the button below to change it.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setIsChanging(true)}
        >
          Change Password
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="old_password">Current Password</Label>
        <Input
          id="old_password"
          type="password"
          value={formData.old_password}
          onChange={(e) =>
            setFormData({
              ...formData,
              old_password: e.target.value,
            })
          }
          placeholder="Enter current password"
          disabled={isLoading}
        />
        {errors.old_password && (
          <p className="text-destructive text-sm">{errors.old_password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="new_password">New Password</Label>
        <Input
          id="new_password"
          type="password"
          value={formData.new_password}
          onChange={(e) =>
            setFormData({
              ...formData,
              new_password: e.target.value,
            })
          }
          placeholder="Enter new password"
          disabled={isLoading}
        />
        {errors.new_password && (
          <p className="text-destructive text-sm">{errors.new_password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm New Password</Label>
        <Input
          id="confirm_password"
          type="password"
          value={formData.confirm_password}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirm_password: e.target.value,
            })
          }
          placeholder="Confirm new password"
          disabled={isLoading}
        />
        {errors.confirm_password && (
          <p className="text-destructive text-sm">{errors.confirm_password}</p>
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
            setIsChanging(false);
            setFormData({
              old_password: "",
              new_password: "",
              confirm_password: "",
            });
            setErrors({});
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </div>
    </form>
  );
}
