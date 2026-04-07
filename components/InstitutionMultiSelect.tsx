"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Check, X, Search, ArrowRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { institutionGroups } from "@/lib/financial-institutions-data"
import type { FinancialInstitution, InstitutionCategory } from "@/types/financial-institution"
import { useLanguage } from "@/lib/i18n/context"
import { getBankLogoPath } from "@/lib/bank-logo-mapper"
import BankConnectionFlow from "./BankConnectionFlow"

interface TransferData {
  transferId: string
  amount: string
  recipient: string
  recipientName: string
  bankName: string
  message: string
  timestamp: string
}

interface InstitutionMultiSelectProps {
  onSelectionChange?: (selected: FinancialInstitution[]) => void
  onContinue?: (selected: FinancialInstitution[]) => void
  transferData?: TransferData | null
}

export default function InstitutionMultiSelect({ onSelectionChange, onContinue, transferData }: InstitutionMultiSelectProps) {
  const { t } = useLanguage()

  const [expandedGroups, setExpandedGroups] = useState<Set<InstitutionCategory>>(new Set())
  const [selectedByCategory, setSelectedByCategory] = useState<Map<InstitutionCategory, string>>(new Map())
  const [searchQuery, setSearchQuery] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return institutionGroups

    const query = searchQuery.toLowerCase()
    return institutionGroups
      .map((group) => ({
        ...group,
        institutions: group.institutions.filter((inst) => inst.name.toLowerCase().includes(query)),
      }))
      .filter((group) => group.institutions.length > 0)
  }, [searchQuery])

  const toggleGroup = (groupId: InstitutionCategory) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const selectInstitution = (institution: FinancialInstitution, categoryId: InstitutionCategory) => {
    const newSelected = new Map(selectedByCategory)

    if (newSelected.get(categoryId) === institution.id) {
      newSelected.delete(categoryId)
    } else {
      newSelected.set(categoryId, institution.id)
    }

    setSelectedByCategory(newSelected)

    if (onSelectionChange) {
      const selectedList = institutionGroups
        .flatMap((group) => group.institutions)
        .filter((inst) => Array.from(newSelected.values()).includes(inst.id))
      onSelectionChange(selectedList)
    }
  }

  const removeInstitution = (categoryId: InstitutionCategory) => {
    const newSelected = new Map(selectedByCategory)
    newSelected.delete(categoryId)
    setSelectedByCategory(newSelected)

    if (onSelectionChange) {
      const selectedList = institutionGroups
        .flatMap((group) => group.institutions)
        .filter((inst) => Array.from(newSelected.values()).includes(inst.id))
      onSelectionChange(selectedList)
    }
  }

  const clearAll = () => {
    setSelectedByCategory(new Map())
    if (onSelectionChange) {
      onSelectionChange([])
    }
  }

  const selectedInstitutionsList = useMemo(() => {
    return institutionGroups
      .flatMap((group) => group.institutions.map((inst) => ({ ...inst, categoryId: group.id })))
      .filter((inst) => Array.from(selectedByCategory.values()).includes(inst.id))
  }, [selectedByCategory])

  const totalSelections = selectedByCategory.size

  const handleContinue = () => {
    if (selectedInstitutionsList.length > 0) {
      setIsConnecting(true)
      onContinue?.(selectedInstitutionsList)
    }
  }

  const handleConnectionComplete = () => {
    setIsConnecting(false)
    clearAll()
  }

  return (
    <>
      <div className="space-y-4">
        <div
          className={cn(
            "bg-card rounded-lg border-2 border-border shadow-sm transition-all duration-300",
            isConnecting && "opacity-50 pointer-events-none",
          )}
        >
          <div className="p-4 border-b border-border bg-muted sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder={t.institutionSelect.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#6D1ED4] focus:ring-2 focus:ring-[#6D1ED4] transition-colors"
                aria-label={t.institutionSelect.searchLabel}
              />
            </div>
          </div>

          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{t.institutionSelect.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {totalSelections > 0
                  ? t.institutionSelect.selectionsCount(totalSelections, totalSelections)
                  : t.institutionSelect.selectInstruction}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {totalSelections > 0 && (
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#6D1ED4] rounded-md hover:bg-[#5A18B0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2 shadow-sm hover:shadow-md animate-in fade-in slide-in-from-right-2 duration-300"
                  aria-label={t.institutionSelect.continue}
                >
                  {t.institutionSelect.continue}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {totalSelections > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-[#6D1ED4] focus:ring-offset-2"
                  aria-label={t.institutionSelect.clearAll}
                >
                  <X className="w-4 h-4" />
                  {t.institutionSelect.clearAll}
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.id)
              const hasSelection = selectedByCategory.has(group.id)
              const selectedId = selectedByCategory.get(group.id)

              return (
                <div key={group.id} className="transition-all">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-accent transition-colors focus:outline-none focus:bg-accent"
                    aria-expanded={isExpanded}
                    aria-controls={`group-${group.id}-content`}
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground transition-transform duration-300 ease-in-out",
                          isExpanded && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                      <span className="text-base font-semibold text-foreground">{t.categories[group.id]}</span>
                      {hasSelection && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-[#6D1ED4] text-white rounded-full">
                          <Check className="w-3 h-3" strokeWidth={3} />
                          {t.institutionSelect.selected}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground italic">{t.institutionSelect.selectOne}</span>
                  </button>

                  <div
                    id={`group-${group.id}-content`}
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
                    )}
                    role="region"
                    aria-labelledby={`group-${group.id}-heading`}
                  >
                    <div className="px-4 py-3 bg-muted">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {group.institutions.map((institution) => {
                          const isSelected = selectedId === institution.id
                          const logoPath = getBankLogoPath(institution.id)

                          return (
                            <button
                              key={institution.id}
                              onClick={() => selectInstitution(institution, group.id)}
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2",
                                isSelected &&
                                  "bg-[#FDB913] text-[#1a1a1a] border-2 border-[#FDB913] shadow-md font-medium scale-[1.02]",
                                !isSelected && "bg-card border-2 border-border hover:border-input hover:shadow-sm",
                              )}
                              role="radio"
                              aria-checked={isSelected}
                              aria-label={`${isSelected ? "Deselect" : "Select"} ${institution.name}`}
                            >
                              {logoPath ? (
                                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-md flex items-center justify-center border border-border overflow-hidden relative">
                                  <Image
                                    src={logoPath || "/placeholder.svg"}
                                    alt={`${institution.name} logo`}
                                    width={40}
                                    height={40}
                                    className="object-contain p-1 w-full h-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none"
                                      const target = e.currentTarget.parentElement
                                      if (target) {
                                        target.innerHTML = `<div class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                          isSelected
                                            ? "bg-[#1a1a1a] border-[#1a1a1a]"
                                            : "bg-background border-muted-foreground"
                                        }"><div class="${isSelected ? "w-2.5 h-2.5 rounded-full bg-[#FDB913]" : ""}"></div></div>`
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                    isSelected
                                      ? "bg-[#1a1a1a] border-[#1a1a1a]"
                                      : "bg-background border-muted-foreground",
                                  )}
                                  aria-hidden="true"
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FDB913]" />}
                                </div>
                              )}
                              <span className={cn("text-sm flex-1", isSelected ? "text-[#1a1a1a]" : "text-foreground")}>
                                {institution.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selectedInstitutionsList.length > 0 && (
          <div className="bg-card rounded-lg border-2 border-border shadow-sm p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">{t.institutionSelect.yourSelected}</h3>
              <span className="text-sm text-muted-foreground">
                {selectedInstitutionsList.length} {t.institutionSelect.connected}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedInstitutionsList.map((inst) => {
                const category = institutionGroups.find((g) => g.id === inst.categoryId)
                return (
                  <button
                    key={inst.id}
                    onClick={() => removeInstitution(inst.categoryId)}
                    className="group inline-flex items-center gap-2 px-3 py-2 bg-[#FDB913] text-[#1a1a1a] rounded-full text-sm font-medium hover:bg-[#e5a811] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB913] focus:ring-offset-2 animate-in zoom-in duration-200"
                    aria-label={t.institutionSelect.removeLabel(inst.name, t.categories[inst.categoryId])}
                  >
                    <span className="flex items-center gap-1.5">
                      {inst.name}
                      <span className="text-xs opacity-75">({category && t.categories[category.id]})</span>
                    </span>
                    <X
                      className="w-4 h-4 text-[#1a1a1a] group-hover:scale-110 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {isConnecting && selectedInstitutionsList.length > 0 && (
        <BankConnectionFlow
          selectedInstitutions={selectedInstitutionsList}
          onBack={() => setIsConnecting(false)}
          onComplete={handleConnectionComplete}
          transferData={transferData}
        />
      )}
    </>
  )
}
