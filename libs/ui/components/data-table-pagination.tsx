import { usePathname, useRouter } from "next/navigation"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface DataTablePaginationProps<TData> {
  className?: string
  showSelectedRows?: boolean
  table: Table<TData>
  currentPageNumber: number
}

export function DataTablePagination<TData>({
  className,
  showSelectedRows,
  table,
  currentPageNumber,
}: DataTablePaginationProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const canGoPrevPage = currentPageNumber > 1
  const canGoNextPage = currentPageNumber < table.getPageCount()

  const changePage = (page: number) => {
    router.push(
      `${pathname}?page=${page}&take=${table.getState().pagination.pageSize}`
    )
  }

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      {showSelectedRows && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
      <div className="ml-auto flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) =>
              router.push(`${pathname}?page=1&take=${Number(value)}`)
            }
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPageNumber} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => changePage(1)}
            disabled={!canGoPrevPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => changePage(currentPageNumber - 1)}
            disabled={!canGoPrevPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => changePage(currentPageNumber + 1)}
            disabled={!canGoNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => changePage(table.getPageCount())}
            disabled={!canGoNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
