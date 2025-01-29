import { ReactNode } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IAppPaginationProps {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  entityName: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  getCanPreviousPage: () => boolean;
  previousPage: () => void;
  getCanNextPage: () => boolean;
  nextPage: () => void;
}

const AppPagination = ({
  totalItems,
  startIndex,
  endIndex,
  entityName,
  totalPages,
  currentPage,
  onPageChange,
  getCanPreviousPage,
  previousPage,
  getCanNextPage,
  nextPage,
}: IAppPaginationProps): ReactNode => {
  return (
    <div className="flex flex-col items-center space-y-4 py-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationItem>
              {getCanPreviousPage() ? (
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    previousPage();
                  }}
                />
              ) : (
                <Button variant="ghost" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
            </PaginationItem>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = currentPage === page - 1;
            const bgColor = !isActive ? 'bg-gray-500' : '';
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  className={`${bgColor} text-black`}
                  isActive={isActive}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page - 1);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            {getCanNextPage() ? (
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  nextPage();
                }}
              />
            ) : (
              <Button variant="ghost" disabled>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-sm text-white">
        {totalItems > 0
          ? `Showing ${startIndex} to ${endIndex} of ${totalItems} ${entityName}`
          : `No ${entityName} to show`}
      </div>
    </div>
  );
};

export default AppPagination;
