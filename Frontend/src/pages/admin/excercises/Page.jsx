import { useEffect, useState } from "react"
import { ArrowUpDown, Dumbbell, Edit, MoreHorizontal, Plus, Search, Trash2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast, ToastContainer } from "react-toastify"
import { useDispatch } from "react-redux"
import { deleteExcercise, fetchExcercises, setStatus } from "../../../../store/excerciseSlice";
import STATUSES from "../../../globals/status/statuses";
import { Link } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux"
import DashboardLayout from '../../../components/layout/DashboardLayout';


const ExercisesPage = () => {
  const { data: exercises = [], status } = useSelector((state) => state.excercise || {});
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [deletingId, setDeletingId] = useState(null);

  // Fetch exercises on mount
  useEffect(() => {
    dispatch(fetchExcercises());
  }, [dispatch]);

  // Handle status updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      dispatch(setStatus(null));
    } 
  }, [status, dispatch]);

  // Handler functions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      dispatch(deleteExcercise(id));
    }
  };

  // Filter exercises based on search term and filters
const filteredExercises = Array.isArray(exercises) 
? exercises.filter((exercise) => {
    const matchesSearch = 
      (exercise.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (exercise.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || exercise.category === categoryFilter;
    
    const matchesDifficulty = difficultyFilter === "all" || 
      (exercise.difficulty_level?.toLowerCase() || "") === difficultyFilter.toLowerCase();
      
    return matchesSearch && matchesCategory && matchesDifficulty;
  }) 
: [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 m-form-padding">
                <div>
          <h1 className="text-3xl mb-2 font-bold tracking-tight">Exercises</h1>
          <p className="text-muted-foreground mb-3">Manage your exercise library</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exercises..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Bodyweight">Bodyweight</SelectItem>
                <SelectItem value="Machine">Machine</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <Link to="/admin/excercise/add" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </Link>
        </div>


        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Exercise Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-2">
                      Exercise
                      <Button variant="ghost" size="sm" className="h-8 p-0">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExercises.map((exercise) => {
                  const imageUrl = exercise.imagePath ? exercise.imagePath.replace(/\\/g, "/") : "";
                  const id = exercise.id || exercise._id;
                  console.log(imageUrl)
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            {imageUrl ? (
                              <img
                                src={`http://localhost:3001/${imageUrl}`}
                                alt={exercise.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <Dumbbell className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{exercise.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">
                          {exercise.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={
                            exercise.difficulty_level === "Beginner"
                              ? "secondary"
                              : exercise.difficulty_level === "Intermediate"
                                ? "default"
                                : "destructive"
                          }
                          className="capitalize"
                        >
                          {exercise.difficulty_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize whitespace-nowrap">{exercise.equipment}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/excercise/${id}`} className="flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredExercises.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No exercises found. Add an exercise to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ToastContainer />
      </div>
    </DashboardLayout>
  )
}

export default ExercisesPage;