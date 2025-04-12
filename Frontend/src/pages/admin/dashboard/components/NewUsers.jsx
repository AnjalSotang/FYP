import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUsersSevenDays } from "../../../../../store/adminUsersSlice";

const NewUsers= () => {
  const dispatch = useDispatch();
  const { data7: users, status } = useSelector((state) => state.adminUsers);

  useEffect(() => {
    dispatch(fetchUsersSevenDays());
  }, [dispatch]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatAvatarUrl = (url) => url?.replace(/\\/g, "/");

  if (status === "loading") return <p>Loading users...</p>;
  if (!users?.length) return <p>No new users in the last 7 days.</p>;

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
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`http://localhost:3001/${formatAvatarUrl(user?.avatar)}`}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </TableCell>
            <TableCell>{user.joined}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(user.status)} className="capitalize px-3 py-1">
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default React.memo(NewUsers);
