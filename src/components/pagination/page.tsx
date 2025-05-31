"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlsProps) {
  const getVisiblePages = () => {
    if (totalPages <= 1) {
      return [1]
    }
    
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  // Always show pagination for debugging, or change to `if (totalPages <= 1) return null` for production
  if (totalPages <= 0) return null

  return (
    <div className="flex items-center justify-center space-x-2 py-2">
      <Button variant="outline" type="button" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {getVisiblePages().map((page, index) => (
        <Button
          type="button"
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={page === currentPage ? "bg-white border-2 hover:bg-blue-pfl" : ""}
        >
          {page}
        </Button>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
