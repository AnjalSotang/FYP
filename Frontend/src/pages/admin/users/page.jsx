import { useState } from "react"
import { ArrowUpDown, Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import DashboardLayout from '../../../components/layout/DashboardLayout';

// Mock data for users
const users = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "admin",
    status: "active",
    joined: "Jan 10, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "user",
    status: "active",
    joined: "Feb 15, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "trainer",
    status: "active",
    joined: "Mar 22, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "user",
    status: "inactive",
    joined: "Apr 5, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    role: "user",
    status: "active",
    joined: "May 18, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "William Taylor",
    email: "william.taylor@example.com",
    role: "trainer",
    status: "active",
    joined: "Jun 30, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    role: "user",
    status: "pending",
    joined: "Jul 12, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Liam Garcia",
    email: "liam.garcia@example.com",
    role: "user",
    status: "active",
    joined: "Aug 25, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Ava Rodriguez",
    email: "ava.rodriguez@example.com",
    role: "user",
    status: "inactive",
    joined: "Sep 8, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Noah Lee",
    email: "noah.lee@example.com",
    role: "trainer",
    status: "active",
    joined: "Oct 17, 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };
  

  return (
    <DashboardLayout>
  <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
    {/* Header section with improved spacing */}
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Users</h1>
      <p className="text-sm md:text-base text-muted-foreground">Manage user accounts and permissions</p>
    </div>

    {/* Filter and search section with better responsiveness */}
    <div className="flex flex-col gap-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="h-10">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl">Add New User</DialogTitle>
              <DialogDescription>Add a new user to your fitness platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-sm">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-sm">
                  Email
                </Label>
                <Input id="email" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right text-sm">
                  Role
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="px-2 pt-2">
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    {/* Table Card with improved spacing */}
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-lg md:text-xl">All Users</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">User</span>
                    <Button variant="ghost" size="sm" className="h-8 p-0">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-medium">Role</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Joined</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize px-3 py-1">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                      }
                      className="capitalize px-3 py-1"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Edit User Dialog with better spacing */}
    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Edit User</DialogTitle>
          <DialogDescription>Make changes to the user profile.</DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right text-sm">
                Name
              </Label>
              <Input id="edit-name" defaultValue={selectedUser.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right text-sm">
                Email
              </Label>
              <Input id="edit-email" type="email" defaultValue={selectedUser.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right text-sm">
                Role
              </Label>
              <Select defaultValue={selectedUser.role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right text-sm">
                Status
              </Label>
              <Select defaultValue={selectedUser.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter className="px-2 pt-2">
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</DashboardLayout>
  )
}

