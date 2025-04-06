import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function AddMeasurementsDialog({type}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would handle the form submission
    // For now, we'll just close the dialog
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">{type === "add" ? "Add Measurements" : "Update Measurements"}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add Body Measurements" : "Update Body Measurements"}</DialogTitle>
          <DialogDescription>
  {type === "add" ? "Track your physical progress by recording your body measurements." : "Update & track your body measurements to track your progress."}
</DialogDescription>

        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="measurements" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
            </TabsList>
            <TabsContent value="measurements" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chest">Chest (in)</Label>
                  <Input id="chest" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist (in)</Label>
                  <Input id="waist" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips (in)</Label>
                  <Input id="hips" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs">Thighs (in)</Label>
                  <Input id="thighs" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms (in)</Label>
                  <Input id="arms" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shoulders">Shoulders (in)</Label>
                  <Input id="shoulders" type="number" step="0.1" placeholder="0.0" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="weight" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input id="weight" type="number" step="0.1" placeholder="0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat">Body Fat %</Label>
                  <Input id="body-fat" type="number" step="0.1" placeholder="0.0" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2 mt-4">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">
  {type === "add" ? "Save Measurements": "Update Measurements"}

</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

