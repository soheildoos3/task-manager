"use client";

import { useAuthStore } from "@/stores/auth.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import ProfileInfo from "@/components/features/dashboard/profile/ProfileInfo";
import ProfileForm from "@/components/features/dashboard/profile/ProfileForm";
import ChangePasswordForm from "@/components/features/dashboard/profile/ChangePasswordForm";
import DeleteAccountDialog from "@/components/features/dashboard/profile/DeleteAccountDialog";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateMe, changePassword, deleteMe, isLoading } =
    useAuthStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = async (data: {
    full_name: string;
    email: string;
  }) => {
    await updateMe({
      full_name: data.full_name || undefined,
      email: data.email,
    });
  };

  const handleChangePassword = async (data: {
    old_password: string;
    new_password: string;
  }) => {
    await changePassword(data);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteMe();
      router.push("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <ProfileInfo user={user} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={{
                  full_name: user.full_name || "",
                  email: user.email || "",
                }}
                onSubmit={handleUpdateProfile}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm
                onSubmit={handleChangePassword}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onDelete={handleDeleteAccount}
                isDeleting={isDeleting}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
