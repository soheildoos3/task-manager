import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="text-primary h-12 w-12 animate-spin" />
      <p className="text-muted-foreground mt-4">Loading...</p>
    </div>
  );
}