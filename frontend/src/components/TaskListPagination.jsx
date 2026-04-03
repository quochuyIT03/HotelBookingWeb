import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TaskListPagination = ({
  handleNextPage,
  handlePreviousPage,
  handlePageChange,
  page,
  totalPages,
}) => {
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page, "...", totalPages);
      }
    }
    return pages;
  };

  const pagesShowNumber = generatePages();

  // Style chung cho text sáng lên trên nền tối
  const baseItemClass = "text-slate-300 hover:text-white hover:bg-white/10 transition-colors border-none";
  const activeClass = "bg-indigo-600 text-white hover:bg-indigo-700 font-bold border-none shadow-lg shadow-indigo-500/20";

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent className="gap-1">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); if(page !== 1) handlePreviousPage(); }}
              className={cn(
                baseItemClass,
                "cursor-pointer",
                page === 1 && "opacity-20 pointer-events-none"
              )}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pagesShowNumber.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis className="text-slate-500" />
              ) : (
                <PaginationLink
                  className={cn(
                    "cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg",
                    p === page ? activeClass : baseItemClass
                  )}
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    if (p !== page) handlePageChange(p);
                  }}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); if(page !== totalPages) handleNextPage(); }}
              className={cn(
                baseItemClass,
                "cursor-pointer",
                page === totalPages && "opacity-20 pointer-events-none"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPagination;