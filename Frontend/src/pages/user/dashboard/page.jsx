// DashboardPage.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar } from "lucide-react"
import RootLayout from '../../../components/layout/UserLayout'
// import { fetchProfile } from "../../../../store/authSlice";
import { useSelector } from "react-redux";

// Import tab content components
import { OverviewTab } from "./components/tabComponents/OverviewTab"
import { WorkoutsTab } from "./components/tabComponents/workoutsTab"
import { ProgressTab } from "./components/tabComponents/progressTab"
import { StatsTab } from "./components/tabComponents/statsTab"
import { PersonalRecordsCard } from "./components/resuableComponents/PersonalCard"
import { MeasurementsHistory } from "./components/resuableComponents/MeasurementHistory"


// Initial personal records data
const initialRecords = [
  // { id: 1, exercise: "Bench Press", value: 185, unit: "lbs", type: "1 rep max" },
  // { id: 2, exercise: "Squat", value: 225, unit: "lbs", type: "1 rep max" },
  // { id: 3, exercise: "Deadlift", value: 275, unit: "lbs", type: "1 rep max" },
]


// Initial measurements data
const initialMeasurements = [
  {
    date: new Date("2024-03-01"),
    weight: 182,
    bodyFat: 18,
    chest: 42,
    waist: 34,
    arms: 15,
    thighs: 24,
  },
  {
    date: new Date("2024-03-15"),
    weight: 180,
    bodyFat: 17.5,
    chest: 42.5,
    waist: 33.5,
    arms: 15.2,
    thighs: 24.2,
  },
]

export default function DashboardPage() {
  
  // const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth || {});
  const [activeTab, setActiveTab] = useState("overview")


  const [measurements, setMeasurements] = useState(initialMeasurements)
  const [records, setRecords] = useState(initialRecords)

   // Handle adding a new measurement
   const handleAddMeasurement = (newMeasurement) => {
    setMeasurements([...measurements, newMeasurement])
  }

  // Handle updating personal records
  const handleUpdateRecords = (updatedRecords) => {
    setRecords(updatedRecords)
  }


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
            <StatsTab  measurements={measurements} />
            <PersonalRecordsCard records={records} onUpdateRecords={handleUpdateRecords} />
          </div>
            <MeasurementsHistory/>

          </TabsContent>
        </Tabs>
      </div>
    </RootLayout>
  )
}