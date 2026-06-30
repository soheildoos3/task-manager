"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
  siblingCount?: number;
  pageLabel?: (current: number, total: number) => string;
  className?: string;
  hideWhenNoPages?: boolean;
}

function PaginationButtonsComponent({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isLoading = false,
  siblingCount = 5,
  pageLabel = (current, total) => `Page ${current} of ${total}`,
  className = "",
  hideWhenNoPages = true,
}: PaginationButtonsProps) {
  if (hideWhenNoPages && totalPages <= 1) {
    return null;
  }

  const getPageRange = () => {
    const range: (number | string)[] = [];
    const total = totalPages;

    if (total <= siblingCount + 2) {
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
    } else {
      range.push(1);

      let start = Math.max(2, currentPage - Math.floor(siblingCount / 2));
      let end = Math.min(total - 1, currentPage + Math.floor(siblingCount / 2));

      if (currentPage <= Math.floor(siblingCount / 2) + 2) {
        end = Math.min(total - 1, siblingCount + 1);
      }

      if (currentPage > total - Math.floor(siblingCount / 2) - 1) {
        start = Math.max(2, total - siblingCount);
      }

      if (start > 2) {
        range.push("…");
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < total - 1) {
        range.push("…");
      }

      if (total > 1) {
        range.push(total);
      }
    }

    return range;
  };

  const pageRange = getPageRange();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && !isFirstPage && !isLoading) {
      onPrevious();
    } else if (e.key === "ArrowRight" && !isLastPage && !isLoading) {
      onNext();
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row ${className}`}
      onKeyDown={handleKeyDown}
    >
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {pageLabel(currentPage, totalPages)}
      </p>

      <div
        className="flex items-center gap-1"
        role="group"
        aria-label="Pagination controls"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isFirstPage || isLoading}
          aria-label="Go to previous page"
          aria-disabled={isFirstPage || isLoading}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {pageRange.map((page, index) => {
          if (typeof page === "string") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm"
                aria-hidden="true"
              >
                {page}
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (page < currentPage) {
                  onPrevious();
                } else if (page > currentPage) {
                  onNext();
                }
              }}
              disabled={page === currentPage || isLoading}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className="hidden min-w-[2rem] sm:flex"
            >
              {page}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isLastPage || isLoading}
          aria-label="Go to next page"
          aria-disabled={isLastPage || isLoading}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}

export const PaginationButtons = memo(PaginationButtonsComponent);
