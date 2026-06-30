"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 rounded-full p-2">
                  <AlertTriangle className="text-destructive h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Something went wrong!
                  </CardTitle>
                  <CardDescription className="mt-1">
                    An unexpected error occurred. Please try again.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {error.digest && (
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground text-xs">
                    Error ID: <span className="font-mono">{error.digest}</span>
                  </p>
                </div>
              )}

              {process.env.NODE_ENV === "development" && (
                <div className="bg-muted max-h-40 overflow-auto rounded-md p-3">
                  <p className="text-destructive font-mono text-xs whitespace-pre-wrap">
                    {error.message || "Unknown error"}
                  </p>
                  {error.stack && (
                    <p className="text-muted-foreground mt-2 font-mono text-xs whitespace-pre-wrap">
                      {error.stack}
                    </p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={reset} className="w-full gap-2 sm:w-auto">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}
