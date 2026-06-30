"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="from-background via-background to-primary/5 relative overflow-hidden bg-gradient-to-br pt-32 pb-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Task Management Made Simple
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Organize Your Tasks
            <span className="text-primary block">Effortlessly</span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
            Streamline your workflow, track progress, and boost productivity
            with our powerful task management platform.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {isAuthenticated ? (
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
