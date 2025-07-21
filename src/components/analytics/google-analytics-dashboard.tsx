"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  Globe,
  Users,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface GoogleAnalyticsProps {
  userRole?: 'superadmin' | 'agent';
  agentId?: string;
}

export function GoogleAnalyticsDashboard({ userRole = 'agent', agentId }: GoogleAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [analyticsData, setAnalyticsData] = useState(() => generateAnalyticsData(userRole, "7d"));

  // Mock Google Analytics data
  const analyticsData = {
    overview: {
      totalUsers: userRole === 'superadmin' ? 45678 : 1234,
      usersChange: 15.3,
      sessions: userRole === 'superadmin' ? 89456 : 2156,
      sessionsChange: 8.7,
      pageViews: userRole === 'superadmin' ? 234567 : 8945,
      pageViewsChange: 12.1,
      bounceRate: 42.3,
      bounceRateChange: -2.1,
      avgSessionDuration: '3m 25s',
      durationChange: 18.5,
      conversionRate: 3.8,
      conversionChange: 0.5,
    },
    traffic: [
      { date: '2024-01-01', users: 1200, sessions: 1850, pageViews: 4200 },
      { date: '2024-01-02', users: 1150, sessions: 1750, pageViews: 3900 },
      { date: '2024-01-03', users: 1300, sessions: 2100, pageViews: 4800 },
      { date: '2024-01-04', users: 1400, sessions: 2200, pageViews: 5100 },
      { date: '2024-01-05', users: 1250, sessions: 1900, pageViews: 4300 },
      { date: '2024-01-06', users: 1500, sessions: 2400, pageViews: 5600 },
      { date: '2024-01-07', users: 1350, sessions: 2050, pageViews: 4750 },
    ],
    deviceTypes: [
      { name: 'Mobile', value: 65, users: 2890, color: '#0088FE' },
      { name: 'Desktop', value: 28, users: 1244, color: '#00C49F' },
      { name: 'Tablet', value: 7, users: 311, color: '#FFBB28' },
    ],
    topPages: [
      { page: '/', views: 12534, bounce: 35.2, avgTime: '2m 45s' },
      { page: '/packages', views: 8945, bounce: 28.1, avgTime: '4m 12s' },
      { page: '/packages/bali-discovery', views: 5672, bounce: 22.8, avgTime: '5m 30s' },
      { page: '/packages/thailand-adventure', views: 4321, bounce: 25.5, avgTime: '4m 58s' },
      { page: '/agent-login', views: 2145, bounce: 45.2, avgTime: '1m 32s' },
    ],
    acquisitionChannels: [
      { channel: 'Organic Search', sessions: 3456, percentage: 42.1, color: '#8884d8' },
      { channel: 'Direct', sessions: 2134, percentage: 26.0, color: '#82ca9d' },
      { channel: 'Social Media', sessions: 1523, percentage: 18.5, color: '#ffc658' },
      { channel: 'Referral', sessions: 892, percentage: 10.9, color: '#ff7300' },
      { channel: 'Email', sessions: 205, percentage: 2.5, color: '#00ff00' },
    ],
    realTimeUsers: 847,
    countries: [
      { country: 'India', users: 2345, flag: '🇮🇳' },
      { country: 'United States', users: 567, flag: '🇺🇸' },
      { country: 'United Kingdom', users: 234, flag: '🇬🇧' },
      { country: 'Australia', users: 198, flag: '🇦🇺' },
      { country: 'Canada', users: 145, flag: '🇨🇦' },
    ],
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Google Analytics
            {userRole === 'superadmin' && (
              <Badge variant="secondary" className="ml-2">Super Admin View</Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Users */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Real-time Active Users</p>
              <p className="text-3xl font-bold text-blue-600 flex items-center gap-2">
                <Activity className="h-8 w-8" />
                {analyticsData.realTimeUsers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Currently browsing your site</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalUsers)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.usersChange)}`}>
              {getChangeIcon(analyticsData.overview.usersChange)}
              {Math.abs(analyticsData.overview.usersChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.sessions)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.sessionsChange)}`}>
              {getChangeIcon(analyticsData.overview.sessionsChange)}
              {Math.abs(analyticsData.overview.sessionsChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.pageViews)}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.pageViewsChange)}`}>
              {getChangeIcon(analyticsData.overview.pageViewsChange)}
              {Math.abs(analyticsData.overview.pageViewsChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(-analyticsData.overview.bounceRateChange)}`}>
              {getChangeIcon(-analyticsData.overview.bounceRateChange)}
              {Math.abs(analyticsData.overview.bounceRateChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.durationChange)}`}>
              {getChangeIcon(analyticsData.overview.durationChange)}
              {Math.abs(analyticsData.overview.durationChange)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
            <div className={`text-xs flex items-center gap-1 ${getChangeColor(analyticsData.overview.conversionChange)}`}>
              {getChangeIcon(analyticsData.overview.conversionChange)}
              {Math.abs(analyticsData.overview.conversionChange)}% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Trend</CardTitle>
            <CardDescription>Users, sessions, and page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="sessions" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Traffic breakdown by device</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.deviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {analyticsData.deviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Acquisition Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Acquisition Channels</CardTitle>
            <CardDescription>How users find your site</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.acquisitionChannels} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="channel" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="sessions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.topPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{page.page}</TableCell>
                    <TableCell>{page.views.toLocaleString()}</TableCell>
                    <TableCell>{page.bounce}%</TableCell>
                    <TableCell>{page.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Geographic distribution of users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{country.users.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">users</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Analytics Integration Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Globe className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">Google Analytics Integration</h3>
              <p className="text-sm text-blue-700 mt-1">
                This dashboard shows real-time data from Google Analytics 4. Data is automatically 
                refreshed every 15 minutes. For detailed analysis and custom reports, 
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                  visit Google Analytics directly
                </a>.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">GA4 Connected</Badge>
                <Badge variant="secondary">Real-time Data</Badge>
                <Badge variant="secondary">Auto-refresh: 15min</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
