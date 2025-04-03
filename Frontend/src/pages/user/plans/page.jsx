import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Clock, Dumbbell, Flame, Filter, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkouts, setStatus } from "../../../../store/workoutSlice";
import { useEffect, useState } from "react";
import STATUSES from "../../../globals/status/statuses";
import RootLayout from '../../../components/layout/UserLayout';


export default function WorkoutPlansPage() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("")


  // Fix: More robust state access with additional safety checks
  const { data: workoutPlans, status } = useSelector((state) => state.workout);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, []);

  useEffect(() => {
    if (status === STATUSES.SUCCESS) {
      dispatch(setStatus(null))
    }
  },
    [status])


  // Set up debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Delay of 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);



  // Now filter based on debouncedSearchTerm
  const filteredWorkout = Array.isArray(workoutPlans)
    ? workoutPlans.filter((exercise) => {
      const matchesSearch =
        (exercise.name?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase()) ||
        (exercise.description?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase());
      return matchesSearch;
    })
    : [];



  return (


    <RootLayout>
      <div className="container mx-auto py-9 px-12">

        <h1 className="text-3xl font-bold mb-1 tracking-tighter">Workout Plans</h1>
        <p className="text-muted-foreground mb-8">
          Browse our collection of expert-designed workout plans for all fitness levels and goals.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search workout plans..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-5">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="fullbody">Full Body</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkout.map((plan) => {
                const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                const id = plan.id || plan._id;
                return (
                  <Card key={id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="relative">
                      {/* Image with fallback logic */}
                      <img
                        src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                        alt={plan.name}
                        className="w-full h-60 object-cover rounded-t-lg"
                      />
                      <Badge
                        className="absolute top-3 right-3"
                        variant={
                          plan.level === "Beginner"
                            ? "default"
                            : plan.level === "Intermediate"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {plan.level}
                      </Badge>
                    </div>

                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 pb-4">
                      <p className="text-muted-foreground mb-4 text-xL">{plan.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="h-4 w-4 text-muted-foreground" />
                          <span>{plan.equipment}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-muted-foreground" />
                          <span>{plan.calories} cal/session</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0">
                      <Link to={`/user/Plan/${plan.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Plan
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>


          <TabsContent value="strength" className="mt-0">



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans
                .filter((plan) => plan.goal === "Strength")
                .map((plan) => {
                  const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                  const id = plan.id || plan._id;
                  return (
                    <Card key={id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="relative">
                        {/* Image with fallback logic */}
                        <img
                          src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                          alt={plan.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge
                          className="absolute top-3 right-3"
                          variant={
                            plan.level === "Beginner"
                              ? "default"
                              : plan.level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {plan.level}
                        </Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{plan.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 pb-4">
                        <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.equipment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.calories} cal/session</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Link to={`/user/Plan/${plan.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Plan
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>





          <TabsContent value="cardio" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans
                .filter((plan) => plan.goal === "Cardio")
                .map((plan) => {
                  const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                  const id = plan.id || plan._id;
                  return (
                    <Card key={id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="relative">
                        {/* Image with fallback logic */}
                        <img
                          src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                          alt={plan.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge
                          className="absolute top-3 right-3"
                          variant={
                            plan.level === "Beginner"
                              ? "default"
                              : plan.level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {plan.level}
                        </Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{plan.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 pb-4">
                        <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.equipment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.calories} cal/session</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Link to={`/user/Plan/${plan.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Plan
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>


          <TabsContent value="fullbody" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans
                .filter((plan) => plan.goal === "Full Body")
                .map((plan) => {
                  const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                  const id = plan.id || plan._id;
                  return (
                    <Card key={id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="relative">
                        {/* Image with fallback logic */}
                        <img
                          src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                          alt={plan.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge
                          className="absolute top-3 right-3"
                          variant={
                            plan.level === "Beginner"
                              ? "default"
                              : plan.level === "Intermediate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {plan.level}
                        </Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 pb-4">
                        <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            {/* <span>{plan.equipment.join(", ")}</span> */}
                            <span>{plan.equipment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.calories} cal/session</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Link to={`/user/Plan/${plan.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Plan
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>


          <TabsContent value="beginner" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans
                .filter((plan) => plan.level === "Beginner")
                .map((plan) => {
                  const imageUrl = plan?.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                  const id = plan.id || plan._id;
                  return (
                    <Card key={id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="relative">
                        {/* Image with fallback logic */}
                        <img
                          src={imageUrl ? `http://localhost:3001/${imageUrl}` : "/placeholder.svg"}
                          alt={plan.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-3 right-3" variant="default">
                          {plan.level}
                        </Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 pb-4">
                        <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.equipment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span>{plan.calories} cal/session</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <Link to={`/user/Plan/${plan.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Plan
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>




        </Tabs>
      </div>
    </RootLayout>
  )

}

