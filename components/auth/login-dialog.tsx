"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, Sparkles, Mail } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupUsername, setSignupUsername] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = await login(loginEmail, loginPassword)
    if (success) {
      setIsOpen(false)
      setLoginEmail("")
      setLoginPassword("")
    } else {
      setError("Invalid email or password")
    }
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = await signup(signupEmail, signupUsername, signupPassword)
    if (success) {
      setIsOpen(false)
      setSignupEmail("")
      setSignupUsername("")
      setSignupPassword("")
    } else {
      setError("Failed to create account")
    }
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="button-3d border-purple-500/30 bg-gray-900/50 hover:bg-purple-600/20 text-purple-200 hover:text-white glass-effect"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900/95 border-purple-500/30 text-white glass-effect max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text flex items-center justify-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            Welcome to AbyssRead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 glass-effect">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-purple-200">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white glass-effect focus:border-purple-400"
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-purple-200">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white glass-effect focus:border-purple-400"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full button-3d bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 relative"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Sign In
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-purple-200">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white glass-effect focus:border-purple-400"
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-purple-200">
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white glass-effect focus:border-purple-400"
                    placeholder="your_username"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-purple-200">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="bg-gray-800/50 border-purple-500/30 text-white glass-effect focus:border-purple-400"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full button-3d bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Create Account
                      <Sparkles className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-sm text-purple-300/70 p-3 bg-gray-800/30 rounded glass-effect border border-purple-500/20">
            <strong className="text-purple-200">✨ Simple Email Authentication</strong>
            <br />
            Create an account with just your email and start reading!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
