
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function BlogPagination({ currentPage, totalPages, hasNext, hasPrev }: BlogPaginationProps) {
  const [location] = useLocation();

  const getPageUrl = (page: number) => {
    const url = new URL(window.location.href);
    if (page === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', page.toString());
    }
    return `${url.pathname}${url.search}`;
  };

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        asChild={hasPrev}
      >
        {hasPrev ? (
          <Link href={getPageUrl(currentPage - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Link>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </>
        )}
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="sm"
                disabled
                className="w-10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="w-10"
              asChild={!isActive}
            >
              {isActive ? (
                pageNum
              ) : (
                <Link href={getPageUrl(pageNum)}>
                  {pageNum}
                </Link>
              )}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        asChild={hasNext}
      >
        {hasNext ? (
          <Link href={getPageUrl(currentPage + 1)}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
