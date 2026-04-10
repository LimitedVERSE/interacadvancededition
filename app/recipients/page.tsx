"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Search, Trash2, Mail, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Recipient {
  id: string
  name: string
  email: string
  nickname?: string
  addedDate: string
}

function RecipientsContent() {
  const router = useRouter()
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecipient, setNewRecipient] = useState({ name: "", email: "", nickname: "" })

  useEffect(() => {
    const saved = localStorage.getItem("recipients")
    if (saved) {
      setRecipients(JSON.parse(saved))
    }
  }, [])

  const saveRecipients = (data: Recipient[]) => {
    localStorage.setItem("recipients", JSON.stringify(data))
    setRecipients(data)
  }

  const addRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      const recipient: Recipient = {
        id: Date.now().toString(),
        ...newRecipient,
        addedDate: new Date().toISOString(),
      }
      saveRecipients([...recipients, recipient])
      setNewRecipient({ name: "", email: "", nickname: "" })
      setShowAddForm(false)
    }
  }

  const deleteRecipient = (id: string) => {
    saveRecipients(recipients.filter((r) => r.id !== id))
  }

  const filteredRecipients = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.nickname?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Recipients</h1>
              <p className="text-sm text-zinc-400">Add and organize your frequent recipients</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#6D1ED4] text-white hover:bg-[#5A18B0]">
            <Plus className="w-4 h-4 mr-2" />
            Add Recipient
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6 bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Add New Recipient</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-400">Full Name</Label>
                <Input
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400">Email Address</Label>
                <Input
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400">Nickname (Optional)</Label>
                <Input
                  value={newRecipient.nickname}
                  onChange={(e) => setNewRecipient({ ...newRecipient, nickname: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addRecipient} className="bg-[#6D1ED4] text-white hover:bg-[#5A18B0]">
                  Add Recipient
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipients.map((recipient) => (
            <Card key={recipient.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#6D1ED4]/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#6D1ED4]" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{recipient.name}</CardTitle>
                      {recipient.nickname && <p className="text-sm text-zinc-500">"{recipient.nickname}"</p>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRecipient(recipient.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{recipient.email}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-2">Added {new Date(recipient.addedDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">No recipients found</h3>
            <p className="text-zinc-600">
              {searchQuery ? "Try adjusting your search" : "Add your first recipient to get started"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function RecipientsPage() {
  return (
    <ProtectedRoute>
      <RecipientsContent />
    </ProtectedRoute>
  )
}
