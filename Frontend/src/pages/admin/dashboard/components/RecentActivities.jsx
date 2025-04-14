import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity } from "lucide-react"
import { fetchRecentActivities } from "../../../../../store/recentActivitiesSlice";


export function RecentActivities() {
      const { data: activities } = useSelector((state) => state.recentActivities);
  
        const dispatch = useDispatch();
        console.log(activities)
      
        useEffect(() => {
          dispatch(fetchRecentActivities());
        }, [dispatch]);


  return (
    <div className="space-y-4">
      {activities.slice(0,5).map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} - {activity.plan}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}