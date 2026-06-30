"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section
      id="cta"
      className="bg-primary text-primary-foreground scroll-mt-16 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Ready to Get Started?
        </h2>
        <p className="text-primary-foreground/80 mx-auto mb-8 max-w-2xl text-lg">
          Join thousands of users who are already managing their tasks more
          effectively.
        </p>
        {isAuthenticated ? (
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/register">
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}
