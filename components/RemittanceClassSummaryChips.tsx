"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { RemittanceClass } from "@/types/remittance"
import { useLanguage } from "@/lib/i18n/context"

export interface RemittanceClassSummaryChipsProps {
  classes: RemittanceClass[]
  selectedIds: string[]
  onRemove?(id: string): void
}

export function RemittanceClassSummaryChips({ classes, selectedIds, onRemove }: RemittanceClassSummaryChipsProps) {
  const { t } = useLanguage()
  const selectedClasses = classes.filter((cls) => selectedIds.includes(cls.id))

  if (selectedClasses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">{t.remittanceSummary.noSelection}</p>
        <p className="text-muted-foreground text-xs mt-1">{t.remittanceSummary.useFilters}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {t.remittanceSummary.selectedClasses(selectedClasses.length)}
        </h3>
        {onRemove && selectedClasses.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedIds.forEach((id) => onRemove?.(id))}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t.remittanceSummary.clearAll}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedClasses.map((cls) => (
          <Badge
            key={cls.id}
            variant="secondary"
            className="pl-3 pr-2 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors group"
          >
            <span className="font-medium">{cls.label}</span>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(cls.id)}
                className="ml-2 h-4 w-4 p-0 hover:bg-transparent opacity-60 group-hover:opacity-100 transition-opacity"
                aria-label={t.remittanceSummary.removeLabel(cls.label)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  )
}
