"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Package,
  Inbox,
  Wallet,
  BarChart3,
  Home,
  Shield,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/agent-dashboard/overview",
    icon: Home,
  },
  {
    name: "Subscription",
    href: "/agent-dashboard/subscription",
    icon: CreditCard,
  },
  {
    name: "Package Management",
    href: "/agent-dashboard/packages",
    icon: Package,
  },
  {
    name: "Booking Inbox",
    href: "/agent-dashboard/bookings",
    icon: Inbox,
  },
  {
    name: "Payout Requests",
    href: "/agent-dashboard/payouts",
    icon: Wallet,
  },
  {
    name: "Analytics",
    href: "/agent-dashboard/analytics",
    icon: BarChart3,
  },
];

export default function AgentNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-lg shadow p-6">
      <div className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
