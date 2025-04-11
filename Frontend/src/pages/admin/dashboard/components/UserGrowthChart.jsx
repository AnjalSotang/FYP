import React from "react"
import * as RechartsPrimitive from "recharts"
import { useEffect, useState } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { useDispatch } from "react-redux"
import { fetchUserGrowth } from "../../../../../store/adminUsersSlice";
import { useSelector } from "react-redux"

export function UserGrowthChart() {
      const { userGrowthChart: data, status } = useSelector((state) => state.adminUsers);

      const dispatch = useDispatch();
      console.log(data)
    
      useEffect(() => {
        dispatch(fetchUserGrowth());
      }, [dispatch]);


  // Config object for the chart component
  const chartConfig = {
    users: {
      color: "#0ea5e9",
      label: "Users",
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    }
  }
    // Fallback data in case of loading or error
    const placeholderData = [
        { date: "Jan 1", users: 200 },
        { date: "Jan 5", users: 250 },
        { date: "Jan 10", users: 300 },
        { date: "Jan 15", users: 280 },
        { date: "Jan 20", users: 350 },
        { date: "Jan 25", users: 400 },
        { date: "Jan 30", users: 500 },
      ];
    
      // Use real data if available, otherwise use placeholder
      const displayData = data.length > 0 ? data : placeholderData;
    

  return (
    <div className="w-full">
    {status == 'loading' && (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      )}
      
      {status == 'error' && (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-red-500">Failed to load chart: {error}</p>
        </div>
      )}


    <ChartContainer className="h-[300px]" config={chartConfig}>
      <RechartsPrimitive.ComposedChart data={displayData}>
        <RechartsPrimitive.XAxis 
          dataKey="date" 
          tickLine={false}
          axisLine={false}
        />
        <RechartsPrimitive.YAxis 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
        <RechartsPrimitive.Line 
          dataKey="users"
          type="monotone"
          strokeWidth={2}
          dot={{ fill: "#0ea5e9", r: 4 }}
        />
        <ChartTooltip
          content={({active, payload}) => (
            <ChartTooltipContent 
              active={active} 
              payload={payload}
              labelKey="date"
            />
          )}
        />
        <ChartLegend
          content={props => (
            <ChartLegendContent {...props} />
          )}
        />
      </RechartsPrimitive.ComposedChart>
    </ChartContainer>
    </div>
  )
}