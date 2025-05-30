"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, ExternalLink, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase"

export function SetupBanner() {
  const [isConfigured, setIsConfigured] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured())

    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem("setup-banner-dismissed")
    setIsDismissed(dismissed === "true")
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem("setup-banner-dismissed", "true")
  }

  if (isConfigured || isDismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Card className="bg-yellow-900/90 border-yellow-500/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-yellow-100 mb-1">Setup Required</h3>
              <p className="text-sm text-yellow-200/80 mb-3">
                AbyssRead is currently using mock data. To connect to your Supabase database:
              </p>
              <ol className="text-sm text-yellow-200/80 space-y-1 mb-3 list-decimal list-inside">
                <li>
                  Update your <code className="bg-yellow-800/50 px-1 rounded">.env.local</code> file with real Supabase
                  credentials
                </li>
                <li>
                  Run the database schema from{" "}
                  <code className="bg-yellow-800/50 px-1 rounded">database/schema.sql</code>
                </li>
                <li>Restart your development server</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-100 hover:bg-yellow-800/50"
                  onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                >
                  <Database className="h-4 w-4 mr-1" />
                  Supabase Dashboard
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-100 hover:bg-yellow-800/50"
                  onClick={() => window.open("https://github.com/your-repo#setup", "_blank")}
                >
                  Setup Guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-800/50 p-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
