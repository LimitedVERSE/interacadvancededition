"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bell, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface NotificationSettings {
  emailOnReceive: boolean
  emailOnSend: boolean
  emailOnDeposit: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
}

function NotificationsContent() {
  const router = useRouter()
  const [settings, setSettings] = useState<NotificationSettings>({
    emailOnReceive: true,
    emailOnSend: true,
    emailOnDeposit: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem("notificationSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-sm text-zinc-400">Manage your email alerts and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {saved && (
          <div className="mb-4 p-4 bg-green-950/50 border border-green-500/20 rounded-lg text-green-400 text-center">
            Settings saved successfully
          </div>
        )}

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-950/50 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">Email Notifications</CardTitle>
                <CardDescription className="text-zinc-400">Configure email alert preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Receive e-Transfer</Label>
                <p className="text-sm text-zinc-400">Get notified when you receive money</p>
              </div>
              <Switch
                checked={settings.emailOnReceive}
                onCheckedChange={(checked) => updateSetting("emailOnReceive", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Send e-Transfer</Label>
                <p className="text-sm text-zinc-400">Get confirmation when money is sent</p>
              </div>
              <Switch
                checked={settings.emailOnSend}
                onCheckedChange={(checked) => updateSetting("emailOnSend", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Deposit Confirmation</Label>
                <p className="text-sm text-zinc-400">Get notified when deposit is completed</p>
              </div>
              <Switch
                checked={settings.emailOnDeposit}
                onCheckedChange={(checked) => updateSetting("emailOnDeposit", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Weekly Digest</Label>
                <p className="text-sm text-zinc-400">Receive weekly transaction summary</p>
              </div>
              <Switch
                checked={settings.weeklyDigest}
                onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-950/50 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Other Notifications</CardTitle>
                <CardDescription className="text-zinc-400">Additional notification channels</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">SMS Notifications</Label>
                <p className="text-sm text-zinc-400">Receive text messages for transactions</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-zinc-400">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  )
}
