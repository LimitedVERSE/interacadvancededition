"use client"

import { useState } from "react"
import { RemittanceClassFilterPanel } from "@/components/RemittanceClassFilterPanel"
import { RemittanceClassSummaryChips } from "@/components/RemittanceClassSummaryChips"
import { REMITTANCE_CLASSES } from "@/lib/remittance-catalog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"

export default function RemittanceClassDemoPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const selectedClasses = REMITTANCE_CLASSES.filter((cls) => selectedIds.includes(cls.id))

  const handleRemoveClass = (id: string) => {
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Remittance Class Configuration</h1>
            <p className="text-muted-foreground">
              Configure and filter transfer types for your money transfer dashboard
            </p>
          </div>

          {/* Filter panel */}
          <RemittanceClassFilterPanel
            classes={REMITTANCE_CLASSES}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />

          {/* Summary chips */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Selected Remittance Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <RemittanceClassSummaryChips
                classes={REMITTANCE_CLASSES}
                selectedIds={selectedIds}
                onRemove={handleRemoveClass}
              />
            </CardContent>
          </Card>

          {/* JSON preview */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">JSON Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted text-foreground p-4 rounded-lg overflow-x-auto text-xs font-mono">
                {JSON.stringify(selectedClasses, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
