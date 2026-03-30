"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface SearchBarProps {
  onSearch?: (term: string) => void
  clientMode?: boolean
}

export default function SearchBar({ onSearch, clientMode = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full" role="search">
      <label htmlFor="bank-search" className="sr-only">
        {t.mainPage.searchLabel}
      </label>
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${clientMode ? "text-gray-400" : "text-zinc-500"}`} />
      <input
        id="bank-search"
        type="search"
        placeholder={t.mainPage.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:border-transparent transition-all ${
          clientMode
            ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm"
            : "border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500"
        }`}
        aria-label={t.mainPage.searchLabel}
        style={{ fontSize: "16px" }}
      />
    </form>
  )
}
