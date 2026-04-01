import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import useStore from '../../store/useStore';

export default function Pagination() {
  const { pagination, setPage } = useStore();
  const { page, totalPages, hasNextPage, hasPrevPage, total, limit } = pagination;

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const safeTotalPages = Math.max(1, totalPages || 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(safeTotalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showLeadingDots = pageNumbers[0] > 1;
  const showTrailingDots = pageNumbers[pageNumbers.length - 1] < safeTotalPages;

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-[linear-gradient(180deg,#ffffff,#fffaf5)] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.05)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-start">
          <div>
            <p className="text-sm font-medium text-zinc-950">Browse profiles</p>
            <p className="text-sm text-zinc-600">
              Showing <span className="font-semibold text-zinc-950">{startItem}-{endItem}</span> of <span className="font-semibold text-zinc-950">{total}</span> profiles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
              Page {page}
            </Badge>
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100">
              {safeTotalPages} total
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
          >
            <ChevronLeft className="size-4" />
            Prev
          </Button>

          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 p-1">
            {showLeadingDots && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(1)}
                  className="h-9 min-w-9 px-3 text-zinc-600 hover:bg-white hover:text-zinc-950"
                >
                  1
                </Button>
                <span className="flex h-9 w-9 items-center justify-center text-zinc-400">
                  <MoreHorizontal className="size-4" />
                </span>
              </>
            )}

            {pageNumbers.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === page ? 'default' : 'ghost'}
                onClick={() => setPage(p)}
                className={p === page
                  ? 'h-9 min-w-9 bg-zinc-950 px-3 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:bg-zinc-800'
                  : 'h-9 min-w-9 px-3 text-zinc-600 hover:bg-white hover:text-zinc-950'}
              >
                {p}
              </Button>
            ))}

            {showTrailingDots && (
              <>
                <span className="flex h-9 w-9 items-center justify-center text-zinc-400">
                  <MoreHorizontal className="size-4" />
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(safeTotalPages)}
                  className="h-9 min-w-9 px-3 text-zinc-600 hover:bg-white hover:text-zinc-950"
                >
                  {safeTotalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
