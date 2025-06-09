
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const AnalyticsChart = () => {
  const data = [
    { name: 'Jan', views: 4000, interactions: 2400 },
    { name: 'Feb', views: 3000, interactions: 1398 },
    { name: 'Mar', views: 2000, interactions: 9800 },
    { name: 'Apr', views: 2780, interactions: 3908 },
    { name: 'May', views: 1890, interactions: 4800 },
    { name: 'Jun', views: 2390, interactions: 3800 },
    { name: 'Jul', views: 3490, interactions: 4300 },
  ];

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-border/40">
      <CardHeader>
        <CardTitle className="text-lg">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="interactions" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
