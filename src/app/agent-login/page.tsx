"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Demo agent credentials
const demoAgent = {
  id: "agent_001",
  email: "demo@agent.com",
  password: "demo123",
  name: "Travel Pro Agency",
  plan: "growth",
};

export default function AgentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check demo credentials
      if (email === demoAgent.email && password === demoAgent.password) {
        // Set agent session
        localStorage.setItem(
          "agent_session",
          JSON.stringify({
            id: demoAgent.id,
            name: demoAgent.name,
            plan: demoAgent.plan,
            email: demoAgent.email,
          }),
        );

        // Navigate to agent dashboard
        router.push("/agent-dashboard");
      } else {
        setError(
          "Invalid email or password. Try the demo account: demo@agent.com / demo123"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Agent Dashboard Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your agent account to manage packages and bookings
          </p>
        </div>

                {/* Demo Account Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">Demo Account</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> demo@agent.com</p>
              <p><strong>Password:</strong> demo123</p>
              <p className="text-blue-600 mt-2">Use these credentials to access the agent dashboard</p>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your registered agent credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an agent account?{" "}
            <button
              onClick={() => router.push("/?register=agent")}
              className="text-blue-600 hover:underline"
            >
              Register as Agent
            </button>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Main Site
            </Link>
          </p>
        </div>

        {/* Agent System Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">Agent Dashboard Features</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Package management and listing tools</p>
              <p>• Booking inbox with status tracking</p>
              <p>• Payout request system</p>
              <p>• Analytics dashboard with metrics</p>
              <p>• Subscription plan management</p>
              <p>• Customer communication tools</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
