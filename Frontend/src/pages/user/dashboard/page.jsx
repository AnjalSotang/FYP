
import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Dumbbell, LineChart, Plus, TrendingUp } from "lucide-react"
import RootLayout from '../../../components/layout/UserLayout';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Workouts",
      value: "24",
      icon: <Dumbbell className="h-4 w-4 text-muted-foreground" />,
      change: "+12% from last month",
    },
    {
      title: "Calories Burned",
      value: "12,450",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      change: "+8% from last month",
    },
    {
      title: "Active Minutes",
      value: "840",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      change: "+15% from last month",
    },
  ]

  const upcomingWorkouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "Today, 5:00 PM",
      duration: "45 min",
    },
    {
      id: 2,
      name: "HIIT Cardio",
      date: "Tomorrow, 6:30 AM",
      duration: "30 min",
    },
    {
      id: 3,
      name: "Leg Day",
      date: "Wed, 5:30 PM",
      duration: "60 min",
    },
  ]

  const recentWorkouts = [
    {
      id: 1,
      name: "Full Body Workout",
      date: "Yesterday, 6:00 PM",
      duration: "60 min",
      calories: "450",
    },
    {
      id: 2,
      name: "Morning Cardio",
      date: "2 days ago, 7:00 AM",
      duration: "30 min",
      calories: "320",
    },
    {
      id: 3,
      name: "Core Strength",
      date: "3 days ago, 5:30 PM",
      duration: "45 min",
      calories: "380",
    },
  ]

  return (
    <RootLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/workouts">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Workout
            </Button>
          </Link>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your workout activity for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Activity Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Workouts</CardTitle>
                <CardDescription>Your scheduled workouts for the next few days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground">{workout.duration}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your completed workouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                      </div>
                      <div className="ml-auto flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">{workout.duration}</div>
                        <div className="text-sm text-muted-foreground">{workout.calories} cal</div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Analytics</CardTitle>
              <CardDescription>Detailed analysis of your fitness progress</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Detailed analytics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Schedule</CardTitle>
              <CardDescription>Your upcoming workout schedule</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Your workout calendar will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    </RootLayout>
    
  )
}

