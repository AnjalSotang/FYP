import { Link, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Clock, Dumbbell, Flame, Save, Share, Loader2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkout } from "../../../../../store/workoutSlice";
import { addUserWorkout, setStatus } from "../../../../../store/userWorkoutSlice";
import STATUSES from "../../../../globals/status/statuses";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WorkoutDay } from "../components/workout-day"
import { useEffect, useState } from 'react';
import RootLayout from '../../../../components/layout/UserLayout';
import classNames from "classnames";



export default function WorkoutPlanPage({ }) {
  const { id } = useParams();
  console.log(id) // Assuming you're using a dynamic route with an ID parameter
  const planId = Number(id)
  console.log(planId);    // Convert to number
  const { status, currentWorkout: workoutPlan } = useSelector((state) => state.workout);
  const { status: status1 } = useSelector((state) => state.userWorkout);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState(null);


  useEffect(() => {
    // If the workoutPlans are empty or not present, trigger the fetch
    dispatch(fetchWorkout(planId));
  }, [dispatch, planId]);


  // Function to set the plan ID and trigger dispatch manually
  const handleAddUserWorkout = (planId) => {
    if (planId && planId !== selectedPlanId) { // Prevent re-setting the same planId
      console.log("Selected Plan ID:", planId);
      setSelectedPlanId(planId);
    }
  };


  // useEffect to dispatch when selectedPlanId changes
  useEffect(() => {
    if (selectedPlanId !== null) { // Prevent initial empty state from dispatching
      console.log("Dispatching workout for plan:", selectedPlanId);
      dispatch(addUserWorkout(selectedPlanId));
      setSelectedPlanId(null); // Reset state to prevent infinite loop
    }
  }, [selectedPlanId, dispatch]); // Runs when selectedPlanId changes


  // Loading state component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-lime-300 animate-spin" />
    </div>
  );

  // If we're still loading or workout not found, show appropriate UI
  if (status?.status === STATUSES.LOADING) {
    return <LoadingSpinner />;
  }

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status1?.status === STATUSES.SUCCESS) {
      // navigate("/");
      toast.success(status1.message);
      console.log(status1.message);
      setIsLoading(false);
      dispatch(setStatus(null));
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message);
    }
  }, [status1]);



  // Check if workout data exists
  const plan = workoutPlan;

  if (!plan || plan.id !== planId) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Workout Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">The workout plan you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Browse All Plans</Button>
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";


  return (
    <RootLayout>
      <div className="container mx-auto py-12 px-12">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to plans
        </Link>
        <ToastContainer position="top-center" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant={
                    plan.level === "Beginner" ? "default" : plan.level === "Intermediate" ? "secondary" : "destructive"
                  }
                >
                  {plan.level}
                </Badge>
                <Badge variant="outline">{plan.goal}</Badge>
                <Badge variant="outline">{plan.duration} min</Badge>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>

            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                alt={plan.name}
                className="w-full h-auto object-cover"
              />
            </div>

            <Tabs defaultValue={plan.days[0]?.id?.toString()} className="mb-8">
              <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${plan.days.length}, 1fr)` }}>
                {plan.days.map((day) => (
                  <TabsTrigger key={day.id} value={day.id.toString()}>
                    {day.dayName.split(' - ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {plan.days.map((day) => (
                <TabsContent key={day.id} value={day.id.toString()}>
                  <WorkoutDay day={day} />
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-10">
              <CardHeader>
                <CardTitle>Plan Overview</CardTitle>
                <CardDescription>Key information about this workout plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration</span>
                  </div>
                  <div>{plan.duration}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Equipment</span>
                  </div>
                  <div className="text-right">{plan.equipment}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Calories/Session</span>
                  </div>
                  <div>{plan.calories}</div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-4">Weekly Schedule</h4>

                  <div className="grid grid-cols-7 gap-1">
                    {plan.days.map((day) => {
                      const focus = day.dayName || "Rest";

                      // Treat it as a Rest day only if the whole thing is 'rest' or 'rest day'
                      const isRestDay = ["rest", "rest day"].includes(focus.trim().toLowerCase());

                      return (
                        <div key={day.dayNumber} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Day {day.dayNumber}</div>
                          <div
                            className={`text-xs rounded-full px-1 py-0.5 ${isRestDay ? "bg-muted" : "bg-primary/10 text-primary"}`}
                          >
                            {isRestDay ? "Rest" : focus.split(" ")[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-5">


                <Button
                  className={classNames(
                    "w-full gap-3",
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  )}
                  onClick={() => handleAddUserWorkout(planId)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save to My Workouts
                    </>
                  )}
                </Button>

                <Button variant="outline" className="w-full gap-3">
                  <Share className="h-4 w-4" />
                  Share Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>


  )
}