
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Smartphone, Monitor } from "lucide-react";

interface AnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Analytics</h1>
        <p className="text-gray-600">Track performance of your AIGE campaigns</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-black">284K</p>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interactions</p>
                <p className="text-2xl font-bold text-black">98K</p>
                <p className="text-xs text-green-600">+15.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Users</p>
                <p className="text-2xl font-bold text-black">89%</p>
                <p className="text-xs text-gray-600">of total traffic</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold text-black">3:42</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-black" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Pie chart coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Campaign performance table coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
