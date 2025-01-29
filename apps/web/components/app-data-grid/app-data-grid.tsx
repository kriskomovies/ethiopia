import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AppPagination from '@/components/app-pagination/app-pagination';
import { getTextColorBasedOnStatus } from '@/utils/common';

interface AbstractGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  filterColumn?: string;
  entityName: string;
  showPagination?: boolean;
  showColumnsSelect?: boolean;
}

export function AppDataGrid<T>({
  data,
  columns,
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  filterColumn = 'name',
  entityName,
  showPagination = true,
  showColumnsSelect = true,
}: AbstractGridProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: currentPage,
          pageSize,
        });
        onPageChange(newState.pageIndex);
      }
    },
  });

  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalItems);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="w-full">
      <div className="flex items-center py-2">
        {/*<Input*/}
        {/*  name="filterEntity"*/}
        {/*  placeholder={`Filter ${entityName}...`}*/}
        {/*  value={*/}
        {/*    (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''*/}
        {/*  }*/}
        {/*  onChange={(event) =>*/}
        {/*    table.getColumn(filterColumn)?.setFilterValue(event.target.value)*/}
        {/*  }*/}
        {/*  values={{}}*/}
        {/*  className="max-w-sm"*/}
        {/*/>*/}
        <DropdownMenu>
          {showColumnsSelect && (
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="mr-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent align="end" className="bg-black text-white">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border-black bg-[rgba(0,0,0,0.7)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <AppPagination
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          entityName={entityName}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          getCanPreviousPage={table.getCanPreviousPage}
          previousPage={table.previousPage}
          getCanNextPage={table.getCanNextPage}
          nextPage={table.nextPage}
        />
      )}
    </div>
  );
}
