import React from "react"
import { useEffect, useState } from "react"
import MetricCard from "./components/MetricCard"
import UserGrowthChart from "./components/UserGrowthChart"
import {RecentActivities} from "./components/RecentActivities"
import NewUsers from "./components/NewUsers"
import PopularWorkoutPlans from "./components/PopularWorkoutPlans"
import { Users, CreditCard, Dumbbell, ListTodo } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useDispatch } from "react-redux"
import { fetchUserMetrics } from "../../../../store/adminUsersSlice";
import { useSelector } from "react-redux"
import { fetchExcerciseMetrics } from "../../../../store/excerciseSlice"
import { fetchWorkoutMetrics } from "../../../../store/workoutSlice"

export default function AdminDashboard() {
  const { userMetrics: metrics } = useSelector((state) => state.adminUsers);
  const { excerciseMetrics } = useSelector((state) => state.excercise);
  const { workoutMetrics } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  console.log(metrics)

  useEffect(() => {
    dispatch(fetchUserMetrics());
    dispatch(fetchExcerciseMetrics())
    dispatch(fetchWorkoutMetrics())
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 m-form-padding">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of FitTrack platform</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics && (
            <MetricCard
              title={metrics.title}
              value={metrics.value}
              description={metrics.description}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          <MetricCard
            title="Active Subscriptions"
            value="2,340"
            description="+5.2% from last month"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          />
          {excerciseMetrics && (
            <MetricCard
            title={excerciseMetrics.title}
            value={excerciseMetrics.value}
            description={excerciseMetrics.description}
              icon={<Dumbbell className="h-4 w-4 text-muted-foreground" />}
            />
          )}
          {workoutMetrics && (
            <MetricCard
            title={workoutMetrics.title}
            value={workoutMetrics.value}
            description={workoutMetrics.description}
              icon={<ListTodo className="h-4 w-4 text-muted-foreground" />}
            />
          )}
      
        </div>

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
      </div>
    </DashboardLayout>
  )
}