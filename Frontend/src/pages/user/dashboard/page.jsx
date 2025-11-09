// DashboardPage.jsx - Fixed StatsTab reference
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar } from "lucide-react"
import RootLayout from '../../../components/layout/UserLayout'
import { useDispatch, useSelector } from "react-redux";
import { fetchMeasurements, setStatus } from "../../../../store/measurementSlice";
// Import tab content components

import { WorkoutsTab } from "./components/tabComponents/workoutsTab"
import { ProgressTab } from "./components/tabComponents/progressTab"
import { StatsTab } from "./components/tabComponents/statsTab"
import { PersonalRecordsCard } from "./components/resuableComponents/PersonalCard"
import { MeasurementsHistory } from "./components/resuableComponents/MeasurementHistory"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { OverviewTab } from "./components/tabComponents/OverviewTab"

export default function DashboardPage() {
  const { data } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchMeasurements());
  }, [dispatch])

  const [activeTab, setActiveTab] = useState("overview")

  return (
    <RootLayout>
      <div className="container mx-auto py-10 px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{data?.username || "User"} Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and manage your workout plans</p>
          </div>

          <div className="flex gap-3">
            <Link href="/generate">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Workout
              </Button>
            </Link>
            <Button className="gap-2">
              <Calendar className="h-4 w-4" />
              Log Workout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">My Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="workouts" className="mt-6">
            <WorkoutsTab />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <StatsTab />  
              <PersonalRecordsCard />
            </div>
            <MeasurementsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  )
}