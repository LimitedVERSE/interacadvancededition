"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { RemittanceClass, RemittanceFilters } from "@/types/remittance"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"

export interface RemittanceClassFilterPanelProps {
  /** All available remittance classes (from catalog or API) */
  classes: RemittanceClass[]
  /** Currently selected class ids */
  selectedIds: string[]
  /** Callback when selection changes */
  onChange(selectedIds: string[]): void
}

interface FilterOption<T> {
  value: T
  label: string
  description?: string
}

export function RemittanceClassFilterPanel({ classes, selectedIds, onChange }: RemittanceClassFilterPanelProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<RemittanceFilters>({})

  // Filter options configuration
  const scopeOptions: FilterOption<string>[] = [
    { value: "domestic", label: t.remittanceFilter.scope.domestic, description: t.remittanceFilter.scope.domesticDesc },
    {
      value: "international",
      label: t.remittanceFilter.scope.international,
      description: t.remittanceFilter.scope.internationalDesc,
    },
  ]

  const entityTypeOptions: FilterOption<string>[] = [
    { value: "personal", label: t.remittanceFilter.entityType.personal },
    { value: "commercial", label: t.remittanceFilter.entityType.commercial },
    { value: "government", label: t.remittanceFilter.entityType.government },
    { value: "institutional", label: t.remittanceFilter.entityType.institutional },
  ]

  const speedOptions: FilterOption<string>[] = [
    { value: "instant", label: t.remittanceFilter.speed.instant, description: t.remittanceFilter.speed.instantDesc },
    { value: "same_day", label: t.remittanceFilter.speed.sameDay, description: t.remittanceFilter.speed.sameDayDesc },
    { value: "batch", label: t.remittanceFilter.speed.batch, description: t.remittanceFilter.speed.batchDesc },
    {
      value: "deferred",
      label: t.remittanceFilter.speed.deferred,
      description: t.remittanceFilter.speed.deferredDesc,
    },
  ]

  const methodOptions: FilterOption<string>[] = [
    { value: "wire", label: t.remittanceFilter.method.wire },
    { value: "ach_eft", label: t.remittanceFilter.method.achEft },
    { value: "card_rail", label: t.remittanceFilter.method.cardRail },
    { value: "mobile_wallet", label: t.remittanceFilter.method.mobileWallet },
    { value: "cash", label: t.remittanceFilter.method.cash },
  ]

  const purposeOptions: FilterOption<string>[] = [
    { value: "payroll", label: t.remittanceFilter.purpose.payroll },
    { value: "vendor", label: t.remittanceFilter.purpose.vendor },
    { value: "settlement", label: t.remittanceFilter.purpose.settlement },
    { value: "escrow", label: t.remittanceFilter.purpose.escrow },
    { value: "refund", label: t.remittanceFilter.purpose.refund },
  ]

  const directionOptions: FilterOption<string>[] = [
    {
      value: "inbound",
      label: t.remittanceFilter.direction.inbound,
      description: t.remittanceFilter.direction.inboundDesc,
    },
    {
      value: "outbound",
      label: t.remittanceFilter.direction.outbound,
      description: t.remittanceFilter.direction.outboundDesc,
    },
  ]

  const valueTierOptions: FilterOption<string>[] = [
    {
      value: "micro",
      label: t.remittanceFilter.valueTier.micro,
      description: t.remittanceFilter.valueTier.microDesc,
    },
    {
      value: "retail",
      label: t.remittanceFilter.valueTier.retail,
      description: t.remittanceFilter.valueTier.retailDesc,
    },
    {
      value: "high_value",
      label: t.remittanceFilter.valueTier.highValue,
      description: t.remittanceFilter.valueTier.highValueDesc,
    },
  ]

  // Compute matching class IDs based on current filters
  const matchingIds = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return []
    }

    return classes
      .filter((cls) => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined) return true
          return cls[key as keyof RemittanceClass] === value
        })
      })
      .map((cls) => cls.id)
  }, [classes, filters])

  // Update parent when matching IDs change
  useMemo(() => {
    if (JSON.stringify(matchingIds) !== JSON.stringify(selectedIds)) {
      onChange(matchingIds)
    }
  }, [matchingIds, selectedIds, onChange])

  const updateFilter = <K extends keyof RemittanceFilters>(key: K, value: RemittanceFilters[K] | undefined) => {
    setFilters((prev) => {
      const next = { ...prev }
      if (value === undefined || value === prev[key]) {
        delete next[key]
      } else {
        next[key] = value
      }
      return next
    })
  }

  const resetFilters = () => {
    setFilters({})
    onChange([])
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-foreground">{t.remittanceFilter.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.remittanceFilter.subtitle}</p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t.remittanceFilter.reset}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scope */}
        <FilterSection
          title={t.remittanceFilter.scope.title}
          description={t.remittanceFilter.scope.description}
          options={scopeOptions}
          value={filters.scope}
          onChange={(val) => updateFilter("scope", val as any)}
        />

        {/* Entity Type */}
        <FilterSection
          title={t.remittanceFilter.entityType.title}
          description={t.remittanceFilter.entityType.description}
          options={entityTypeOptions}
          value={filters.entityType}
          onChange={(val) => updateFilter("entityType", val as any)}
        />

        {/* Speed */}
        <FilterSection
          title={t.remittanceFilter.speed.title}
          description={t.remittanceFilter.speed.description}
          options={speedOptions}
          value={filters.speed}
          onChange={(val) => updateFilter("speed", val as any)}
        />

        {/* Method */}
        <FilterSection
          title={t.remittanceFilter.method.title}
          description={t.remittanceFilter.method.description}
          options={methodOptions}
          value={filters.method}
          onChange={(val) => updateFilter("method", val as any)}
        />

        {/* Purpose */}
        <FilterSection
          title={t.remittanceFilter.purpose.title}
          description={t.remittanceFilter.purpose.description}
          options={purposeOptions}
          value={filters.purpose}
          onChange={(val) => updateFilter("purpose", val as any)}
        />

        {/* Direction */}
        <FilterSection
          title={t.remittanceFilter.direction.title}
          description={t.remittanceFilter.direction.description}
          options={directionOptions}
          value={filters.direction}
          onChange={(val) => updateFilter("direction", val as any)}
        />

        {/* Value Tier */}
        <FilterSection
          title={t.remittanceFilter.valueTier.title}
          description={t.remittanceFilter.valueTier.description}
          options={valueTierOptions}
          value={filters.valueTier}
          onChange={(val) => updateFilter("valueTier", val as any)}
        />

        {/* Results summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters ? (
                <>
                  {t.remittanceFilter.matchingClasses}{" "}
                  <span className="font-semibold text-foreground">{matchingIds.length}</span>
                </>
              ) : (
                t.remittanceFilter.selectFilters
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FilterSectionProps {
  title: string
  description: string
  options: FilterOption<string>[]
  value: string | undefined
  onChange: (value: string | undefined) => void
}

function FilterSection({ title, description, options, value, onChange }: FilterSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(isActive ? undefined : option.value)}
              className={cn(
                "transition-all",
                isActive
                  ? "bg-[#6D1ED4] text-white hover:bg-[#5A18B0] border-[#6D1ED4]"
                  : "bg-background hover:bg-muted border-border text-foreground",
              )}
              title={option.description}
            >
              {option.label}
              {option.description && <span className="ml-1.5 text-xs opacity-70">{isActive && "✓"}</span>}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
