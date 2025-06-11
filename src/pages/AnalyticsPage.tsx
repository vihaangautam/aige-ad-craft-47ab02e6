
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Monitor, 
  ArrowUp, 
  ArrowDown,
  Search,
  Filter,
  Lightbulb,
  Users,
  MousePointer,
  Clock,
  Eye
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsPageProps {
  onNavigate: (path: string) => void;
}

// Sample data for charts
const viewsData = [
  { name: 'Jan', views: 12000, interactions: 3200 },
  { name: 'Feb', views: 19000, interactions: 4100 },
  { name: 'Mar', views: 15000, interactions: 3800 },
  { name: 'Apr', views: 22000, interactions: 5200 },
  { name: 'May', views: 28000, interactions: 6800 },
  { name: 'Jun', views: 24000, interactions: 5900 },
  { name: 'Jul', views: 32000, interactions: 7800 },
];

const deviceData = [
  { name: 'Mobile', value: 68, color: '#FACC15' },
  { name: 'Desktop', value: 24, color: '#000000' },
  { name: 'Tablet', value: 8, color: '#6B7280' },
];

const campaignsData = [
  { id: 1, name: 'Summer Fashion AR Try-On', views: '1.2M', ctr: '3.4%', conversion: '2.1%', status: 'Active' },
  { id: 2, name: 'Interactive Product Demo', views: '890K', ctr: '4.2%', conversion: '3.8%', status: 'Active' },
  { id: 3, name: 'Virtual Store Experience', views: '750K', ctr: '2.9%', conversion: '1.9%', status: 'Paused' },
  { id: 4, name: 'Gaming Brand Partnership', views: '650K', ctr: '5.1%', conversion: '4.2%', status: 'Active' },
  { id: 5, name: 'Holiday Collection Launch', views: '540K', ctr: '3.7%', conversion: '2.8%', status: 'Completed' },
];

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaignsData.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MetricCard = ({ title, value, change, icon: Icon, trend, tooltip }: {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: 'up' | 'down';
    tooltip: string;
  }) => (
    <Card className="hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 animate-fade-in group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative group/tooltip">
                  <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center text-xs">?</div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {tooltip}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold text-black mb-1">{value}</p>
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <ArrowUp className="w-3 h-3 text-green-600" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-600" />
              )}
              <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change} from last month
              </p>
            </div>
          </div>
          <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-black" />
          </div>
        </div>
        
        {/* Mini sparkline */}
        <div className="mt-4 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsData.slice(-7)}>
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#FACC15" 
                fill="#FACC15" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track performance and gain insights from your AIGE campaigns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value="2.8M"
          change="+12.5%"
          icon={Eye}
          trend="up"
          tooltip="Total number of views across all campaigns"
        />
        <MetricCard
          title="Interactions"
          value="385K"
          change="+15.3%"
          icon={MousePointer}
          trend="up"
          tooltip="User interactions including clicks, taps, and engagements"
        />
        <MetricCard
          title="Mobile Users"
          value="68%"
          change="+3.2%"
          icon={Smartphone}
          trend="up"
          tooltip="Percentage of users accessing via mobile devices"
        />
        <MetricCard
          title="Avg. Session"
          value="4:32"
          change="+8.7%"
          icon={Clock}
          trend="up"
          tooltip="Average time users spend in your experiences"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Views Over Time</CardTitle>
              <div className="flex gap-2">
                {['7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    size="sm"
                    variant={timeRange === range ? "default" : "outline"}
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? "bg-yellow-400 text-black hover:bg-yellow-500" : ""}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#FACC15" 
                    strokeWidth={3}
                    dot={{ fill: '#FACC15', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interactions" 
                    stroke="#000000" 
                    strokeWidth={2}
                    dot={{ fill: '#000000', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Performing Campaigns</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Campaign Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">CTR</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Conversion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => console.log(`Navigate to campaign ${campaign.id}`)}
                  >
                    <td className="py-3 px-4 font-medium text-black">{campaign.name}</td>
                    <td className="py-3 px-4 text-gray-600">{campaign.views}</td>
                    <td className="py-3 px-4 text-gray-600">{campaign.ctr}</td>
                    <td className="py-3 px-4 text-gray-600">{campaign.conversion}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                        className={campaign.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {campaign.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights Section */}
      <Card className="animate-fade-in bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Smart Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-black mb-1">Mobile Optimization Opportunity</h4>
                <p className="text-sm text-gray-600">Your mobile CTR is 20% higher than desktop. Consider creating more mobile-first experiences to maximize engagement.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-black mb-1">Peak Performance Time</h4>
                <p className="text-sm text-gray-600">Your campaigns perform 35% better between 6-9 PM. Schedule your next launch during these hours.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-black mb-1">AR Filter Success</h4>
                <p className="text-sm text-gray-600">AR experiences have 40% longer session duration. Consider adding AR elements to boost engagement.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
