"use client"

import { useState, useCallback } from "react"

interface UseSearchOnEnterOptions {
  initialValue?: string
  onSearch?: (searchTerm: string) => void
  resetPageOnSearch?: boolean
  onPageReset?: () => void
}

export function useSearchOnEnter(options: UseSearchOnEnterOptions = {}) {
  const { initialValue = "", onSearch, resetPageOnSearch = true, onPageReset } = options

  const [inputValue, setInputValue] = useState(initialValue)
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.key === "Enter") {
        setSearchTerm(inputValue)
        onSearch?.(inputValue)

        if (resetPageOnSearch) {
          onPageReset?.()
        }
      }
    },
    [inputValue, onSearch, resetPageOnSearch, onPageReset],
  )

  const handleSearch = useCallback(() => {
    setSearchTerm(inputValue)
    onSearch?.(inputValue)

    if (resetPageOnSearch) {
      onPageReset?.()
    }
  }, [inputValue, onSearch, resetPageOnSearch, onPageReset])

  const handleClear = useCallback(() => {
    setInputValue("")
    setSearchTerm("")
    onSearch?.("")

    if (resetPageOnSearch) {
      onPageReset?.()
    }
  }, [onSearch, resetPageOnSearch, onPageReset])

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  return {
    inputValue,
    searchTerm,
    handleKeyDown,
    handleSearch,
    handleClear,
    handleInputChange,
    hasActiveSearch: searchTerm.length > 0,
  }
}
