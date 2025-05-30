"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PageLoader } from "@/components/loading-states"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/?error=auth_failed")
          return
        }

        if (data.session) {
          // User is authenticated, redirect to home
          router.push("/")
        } else {
          // No session, redirect to home
          router.push("/")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/?error=auth_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return <PageLoader />
}
