import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, CreditCard, Dumbbell, ListTodo, TrendingUp, Users } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import * as RechartsPrimitive from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
    <div className="flex flex-col gap-6 m-form-padding">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your fitness platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value="12,345"
          description="+12% from last month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Subscriptions"
          value="2,340"
          description="+5.2% from last month"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Exercises"
          value="543"
          description="+24 new this month"
          icon={<Dumbbell className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Workout Plans"
          value="128"
          description="+8 new this month"
          icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>User acquisition over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <UserGrowthChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest user activities on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Popular Workout Plans</CardTitle>
                <CardDescription>Most used workout plans this month</CardDescription>
              </CardHeader>
              <CardContent>
                <PopularWorkoutPlans />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>New Users</CardTitle>
                <CardDescription>Users who joined in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <NewUsers />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed platform metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics content would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download platform reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Reports content would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  )
}

function MetricCard({ title, value, description, icon }){
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function UserGrowthChart() {
  const data = [
    { date: "Jan 1", users: 200 },
    { date: "Jan 5", users: 250 },
    { date: "Jan 10", users: 300 },
    { date: "Jan 15", users: 280 },
    { date: "Jan 20", users: 350 },
    { date: "Jan 25", users: 400 },
    { date: "Jan 30", users: 500 },
  ]

  // Config object for the new chart component
  const chartConfig = {
    users: {
      color: "#0ea5e9",
      label: "Users",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    }
  }

  return (
    <ChartContainer className="h-[300px]" config={chartConfig}>
      <RechartsPrimitive.ComposedChart data={data}>
        <RechartsPrimitive.XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
        />
        <RechartsPrimitive.YAxis 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
        <RechartsPrimitive.Line 
          dataKey="users"
          type="monotone"
          strokeWidth={2}
          dot={{ fill: "#0ea5e9", r: 4 }}
        />
        <ChartTooltip
          content={({active, payload}) => (
            <ChartTooltipContent 
              active={active} 
              payload={payload}
              labelKey="date"
            />
          )}
        />
        <ChartLegend
          content={props => (
            <ChartLegendContent {...props} />
          )}
        />
      </RechartsPrimitive.ComposedChart>
    </ChartContainer>
  )
}

function RecentActivities() {
  const activities = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "Completed workout",
      plan: "Full Body Strength",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "Created new workout",
      plan: "HIIT Cardio",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: "Emma Davis",
      action: "Subscribed",
      plan: "Premium Plan",
      time: "6 hours ago",
    },
    {
      id: 4,
      user: "James Wilson",
      action: "Achieved goal",
      plan: "Weight Loss Challenge",
      time: "12 hours ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} - {activity.plan}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

function PopularWorkoutPlans() {
  const plans = [
    { id: 1, name: "30-Day Strength Challenge", users: 1245, trend: "up" },
    { id: 2, name: "HIIT Cardio Blast", users: 987, trend: "up" },
    { id: 3, name: "Yoga for Beginners", users: 876, trend: "down" },
    { id: 4, name: "Full Body Transformation", users: 654, trend: "up" },
  ]

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div key={plan.id} className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{plan.name}</p>
            <p className="text-sm text-muted-foreground">{plan.users} active users</p>
          </div>
          <div>
            {plan.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function NewUsers() {
  const users = [
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex@example.com",
      joined: "Mar 14, 2023",
      status: "active",
    },
    {
      id: 2,
      name: "Taylor Swift",
      email: "taylor@example.com",
      joined: "Mar 13, 2023",
      status: "active",
    },
    {
      id: 3,
      name: "Jamie Oliver",
      email: "jamie@example.com",
      joined: "Mar 12, 2023",
      status: "pending",
    },
    {
      id: 4,
      name: "Robert Johnson",
      email: "robert@example.com",
      joined: "Mar 11, 2023",
      status: "active",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </TableCell>
            <TableCell>{user.joined}</TableCell>
            <TableCell>
              <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}