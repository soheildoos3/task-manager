"use client";

import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar } from "lucide-react";

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
          {getInitials(user.full_name)}
        </AvatarFallback>
      </Avatar>
      <h2 className="mt-4 text-xl font-bold">{user.full_name || "User"}</h2>
      <Badge variant="secondary" className="mt-2">
        {user.is_active ? "Active" : "Inactive"}
      </Badge>
      <div className="mt-6 w-full space-y-3 text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Joined: {formatDate(user.created_at)}</span>
        </div>
        {user.last_login && (
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last login: {formatDate(user.last_login)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
