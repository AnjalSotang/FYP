import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchUsersSevenDays } from "../../../../../store/adminUsersSlice";
import { useSelector } from "react-redux"

export function NewUsers() {
  const { data7: users, status } = useSelector((state) => state.adminUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsersSevenDays());
  }, [dispatch]);


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
        {users.map((user) => {
          const imageUrl = user?.avatar ? user.avatar.replace(/\\/g, "/") : "";

          return (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`http://localhost:3001/${imageUrl}`} alt={user.name} /> <AvatarFallback>
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>{user.joined}</TableCell>
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
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}