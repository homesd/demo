import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PlanLimitsWidget from "@/components/agent/plan-limits-widget";
import { AgentStatusBanner } from "@/components/agent/agent-status-banner";
import {
  Building2,
  CreditCard,
  Package,
  Inbox,
  TrendingUp,
  Users,
  IndianRupee,
  Camera,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AgentOverviewPage() {
  // Mock data - in real app this would come from API
  const agentData = {
    isRegistered: false,
    currentPlan: "trial" as const,
    packageCount: 2,
    packageLimit: 3,
    photoCount: 15,
    photoLimit: 30,
    pendingBookings: 3,
    totalRevenue: 125000,
    conversionRate: 3.2,
  };

  const planUsage = {
    packages: {
      current: agentData.packageCount,
      limit: agentData.packageLimit,
    },
    photos: {
      current: agentData.photoCount,
      limit: agentData.photoLimit,
    },
    bookingsThisMonth: {
      current: agentData.pendingBookings,
      limit:
        agentData.currentPlan === "trial"
          ? 5
          : agentData.currentPlan === "growth"
            ? 50
            : -1,
    },
  };

  const stats = [
    {
      title: "Total Packages",
      value: agentData.packageCount,
      limit: agentData.packageLimit,
      icon: Package,
      href: "/agent-dashboard/packages",
    },
    {
      title: "Photos Used",
      value: agentData.photoCount,
      limit: agentData.photoLimit,
      icon: Camera,
      href: "/agent-dashboard/packages",
    },
    {
      title: "Pending Bookings",
      value: agentData.pendingBookings,
      icon: Inbox,
      href: "/agent-dashboard/bookings",
    },
    {
      title: "Total Revenue",
      value: `₹${agentData.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      href: "/agent-dashboard/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Manage your travel business with Roam Southeast
        </p>
      </div>

      {/* Agent Status Banner */}
      <AgentStatusBanner />

      {/* Registration Status */}
      {!agentData.isRegistered && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">
                Complete Your Registration
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              You need to complete your agent registration to start listing
              packages and receiving bookings.
            </CardDescription>
          </CardHeader>
                    <CardContent>
            <Button asChild>
              <Link href="/?register=agent">
                <Building2 className="h-4 w-4 mr-2" />
                Complete Registration
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Plan Limits Widget */}
      <PlanLimitsWidget currentPlan={agentData.currentPlan} usage={planUsage} />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof stat.value === "string" ? stat.value : stat.value}
                      {stat.limit && (
                        <span className="text-sm font-normal text-gray-500">
                          /{stat.limit}
                        </span>
                      )}
                    </p>
                  </div>
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                {stat.href && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 w-full"
                    asChild
                  >
                    <Link href={stat.href}>View Details</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex-col space-y-2" asChild>
              <Link href="/agent-dashboard/packages">
                <Package className="h-6 w-6" />
                <span>Create Package</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              asChild
            >
              <Link href="/agent-dashboard/bookings">
                <Inbox className="h-6 w-6" />
                <span>View Bookings</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex-col space-y-2"
              asChild
            >
              <Link href="/agent-dashboard/analytics">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
