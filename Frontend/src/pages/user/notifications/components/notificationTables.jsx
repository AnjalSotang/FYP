import React, { useEffect } from "react";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,

  User,
  Dumbbell,
  Trash,
  CheckCircle,
  PlusCircle,
  Bell,
  CalendarCheck,
  Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationAction,
  fetchUnreadCount as fetchUnreadCountAction,
} from "../../../../../store/userNotificationSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: notifications } = useSelector((state) => state.userNotification);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);



  const getTypeIcon = (type) => {
    switch (type) {
      case "workout_reminder":
        return <CalendarCheck className="h-4 w-4 text-blue-500" />; // reminder = calendar icon
      case "achievement":
        return <Trophy className="h-4 w-4 text-green-500" />; // achievement = trophy icon
      case "workout_creation":
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      case "workout_added":
        return <User className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />; // default = bell
    }
  };


  const getTypeDisplayName = (type) => {
    switch (type) {
      case "workout_reminder":
        return "Scheduled Reminder";
      case "workout_creation":
        return "New Workout Added";
      case "achievement":
        return "Achievement";
      case "workout_added":
        return "User Workout";
      default:
        return type;
    }
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotificationAction(id));
  };

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type");
        return (
          <div className="flex items-center">
            {getTypeIcon(type)}
            <span className="ml-2 capitalize">{getTypeDisplayName(type)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const isRead = row.original.read;
        return <div className={`font-medium ${isRead ? "" : "font-semibold"}`}>{row.getValue("title")}</div>;
      },
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => <div className="max-w-md truncate">{row.getValue("message")}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
    },
    {
      accessorKey: "read",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.getValue("read");
        return <Badge variant={isRead ? "outline" : "default"}>{isRead ? "Read" : "Unread"}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const notification = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {!notification.read && (
                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>Mark as read</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate(`/admin/notifications/${notification.id}`)}>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteNotification(notification.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: notifications || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter notifications..."
          value={(table.getColumn("title")?.getFilterValue() ?? "")}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Type <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={table.getColumn("type")?.getFilterValue() === "workout_reminder"}
                onCheckedChange={() => {
                  table.getColumn("type")?.setFilterValue("workout_reminder");
                }}
              >
                Reminder
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("type")?.getFilterValue() === "achievement"}
                onCheckedChange={() => {
                  table.getColumn("type")?.setFilterValue("achievement");
                }}
              >
                Achievement
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("type")?.getFilterValue() === "workout_added"}
                onCheckedChange={() => {
                  table.getColumn("type")?.setFilterValue("workout_added");
                }}
              >
                User Workout
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("type")?.getFilterValue() === "workout_creation"}
                onCheckedChange={() => {
                  table.getColumn("type")?.setFilterValue("workout_added");
                }}
              >
                New Workout
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={!table.getColumn("type")?.getFilterValue()}
                onCheckedChange={() => {
                  table.getColumn("type")?.setFilterValue(undefined);
                }}
              >
                All
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleMarkAllAsRead} variant="outline">
            Mark all as read
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}