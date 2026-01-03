"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface SearchBarProps {
  onSearch?: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-auto" role="search">
      <label htmlFor="bank-search" className="sr-only">
        {t.mainPage.searchLabel}
      </label>
      <input
        id="bank-search"
        type="search"
        placeholder={t.mainPage.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-64 pl-4 pr-12 py-2.5 border-2 border-gray-300 rounded-full text-gray-700 bg-white focus:outline-none focus:border-[#FDB913] focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 transition-all"
        aria-label={t.mainPage.searchLabel}
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FDB913] hover:bg-[#e5a710] text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-1 shadow-sm"
        aria-label={t.mainPage.searchLabel}
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  )
}
