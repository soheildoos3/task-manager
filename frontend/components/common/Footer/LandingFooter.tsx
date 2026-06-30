import { ClipboardList } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-primary h-5 w-5" />
            <span className="font-semibold">TaskManager</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TaskManager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
