import React from "react"
import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {fetchPopularWorkouts } from "../../../../../store/workoutSlice";
import { useSelector } from "react-redux"


const PopularWorkoutPlans = () => {
   const { popularData: plans } = useSelector((state) => state.workout);
  const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(fetchPopularWorkouts());
    }, [dispatch]);

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div key={plan.id} className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{plan.name}</p>
            <p className="text-sm text-muted-foreground">{plan.users} active users</p>
          </div>
          <div>
            {plan.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(PopularWorkoutPlans);