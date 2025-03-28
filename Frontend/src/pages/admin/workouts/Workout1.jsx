import { useEffect, useState } from "react"
import { ArrowRightCircle, ArrowUpDown, Calendar, ListTodo, MoreHorizontal, Plus, Search, Star, Trash2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { deleteWorkout, fetchWorkouts, setStatus } from "../../../../store/workoutSlice";
import STATUSES from "../../../globals/status/statuses";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function WorkoutPlansPage() {
  const dispatch = useDispatch();

  // Fix: More robust state access with additional safety checks
  const { data: workoutPlans = [], status } = useSelector((state) => state.workout || {});
  const [deletingId, setDeletingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPlans = Array.isArray(workoutPlans) ? workoutPlans.filter((plan) => {
    const matchesSearch =
      (plan.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (plan.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    // Fix level filter - make case-insensitive comparison
    const matchesLevel = levelFilter === "all" ||
      plan.level?.toLowerCase() === levelFilter.toLowerCase()

    // Fix status filter - use is_active instead of status
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && plan.is_active === true) ||
      (statusFilter === "draft" && plan.is_active !== true)
    console.log(plan.is_active, statusFilter)

    return matchesSearch && matchesLevel && matchesStatus
  }) : [];


  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);


  // Handler functions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      dispatch(deleteWorkout(id));
    }
  };

  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Handle status updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      dispatch(setStatus(null));
    }
  }, [status, dispatch]);

  return (
    <DashboardLayout>

      <div className="flex flex-col gap-6 m-form-padding">
        <div>
          <h1 className="text-3xl mb-2 font-bold tracking-tight">Workout Plans</h1>
          <p className="text-muted-foreground mb-3">Manage workout plans for your users</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plans..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>



          <Link to="/AddWorkout" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Workout Plan
            </Button>
          </Link>

        </div>




        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Workout Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-2">
                      Plan
                      <Button variant="ghost" size="sm" className="h-8 p-0">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>


                {filteredPlans.map((plan) => {
                  const imageUrl = plan.imagePath ? plan.imagePath.replace(/\\/g, "/") : "";
                  const id = plan.id || plan._id;

                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-md border">
                            {/* Replace Image component with a div containing a fallback image */}
                            {
                              imageUrl ? (
                                <img
                                  src={`http://localhost:3001/${imageUrl}`}
                                  alt={plan.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                  <ListTodo className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )
                            }
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{plan.name}</p>
                              {plan.featured && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{plan.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plan.level === "Beginner"
                              ? "secondary"
                              : plan.level === "Intermediate"
                                ? "default"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {plan.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{plan.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={plan.is_active ? "outline" : "destructive"}
                          className={plan.is_active ? "bg-blue-500 text-white" : "bg-red-500 text-white"}
                        >
                          {plan.is_active ? "Active" : "Draft"}
                        </Badge>



                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-navy-600 transition-colors">
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-navy-900 rounded-md shadow-lg border border-navy-600">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/Workout/${id}`}
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-navy-700 hover:text-lime-300 transition-colors"
                              >
                                <ArrowRightCircle className="w-4 h-4 mr-3" />
                                Go to Workout
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingId(id);
                                handleDelete(id).finally(() => {
                                  setDeletingId(null);
                                });
                              }}
                              disabled={deletingId === id}
                              className="flex items-center w-full text-left px-4 py-3 text-red-400 hover:bg-navy-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}


                {filteredPlans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No workout plans found. Add a plan to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}