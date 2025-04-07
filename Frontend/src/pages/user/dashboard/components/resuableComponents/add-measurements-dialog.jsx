// Updated AddMeasurementsDialog.jsx - With operation type handling
import React, { useEffect, useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import { addMeasurement, updateMeasurement } from "../../../../../../store/measurementSlice"

export function AddMeasurementsDialog({ type, data, children, className, onBeforeSubmit }) {
  const dispatch = useDispatch()
  const measurements = data
  
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    shoulders: "",
    thighs: "",
    date: new Date(),
  })

  // If updating, populate form with latest measurement
  useEffect(() => {
    if (type === "update" && measurements && measurements.length > 0) {
      const latest = measurements[measurements.length - 1]
      
      setFormData({
        id: latest.id, // Important for updates
        weight: latest.weight || "",
        bodyFat: latest.bodyFat || "",
        chest: latest.chest || "",
        waist: latest.waist || "",
        hips: latest.hips || "",
        arms: latest.arms || "",
        shoulders: latest.shoulders || "",
        thighs: latest.thighs || "",
        date: new Date(latest.date),
      })
    }
  }, [type, measurements, open])

  const handleChange = (e) => {
    const { id, value } = e.target
    let fieldName = id
    
    // Convert id to camelCase if needed (e.g., body-fat → bodyFat)
    if (id === "body-fat") fieldName = "bodyFat"
    
    setFormData({
      ...formData,
      [fieldName]: value,
    })
  }

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Notify parent component about operation type before submission
    if (onBeforeSubmit) {
      onBeforeSubmit(type)
    }
    
    // Convert all measurement values to numbers
    const numericData = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'date' && key !== 'id') {
        acc[key] = formData[key] === "" ? null : parseFloat(formData[key])
      } else {
        acc[key] = formData[key]
      }
      return acc
    }, {})
    
    if (type === "add") {
      dispatch(addMeasurement({
        ...numericData,
        date: formData.date.toISOString().split('T')[0],
      }))
    } else {
      dispatch(updateMeasurement({
        id: formData.id,
        ...numericData,
        date: formData.date.toISOString().split('T')[0],
      }))
    }
    
    setOpen(false)
  }

  // Default button if no children are provided
  const defaultButton = type === "add" ? (
    <Button className={cn("w-full", className)}>Add Measurements</Button>
  ) : (
    <Button variant="outline" className={cn("w-full", className)}>Update Measurements</Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || defaultButton}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add Body Measurements" : "Update Latest Measurements"}
          </DialogTitle>
          <DialogDescription>
            {type === "add" 
              ? "Track your physical progress by recording your body measurements." 
              : "Edit your most recent measurement record to fix any errors."}
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
                  <Input 
                    id="chest" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.chest}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist (in)</Label>
                  <Input 
                    id="waist" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.waist}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hips">Hips (in)</Label>
                  <Input 
                    id="hips" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.hips}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thighs">Thighs (in)</Label>
                  <Input 
                    id="thighs" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.thighs}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arms">Arms (in)</Label>
                  <Input 
                    id="arms" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.arms}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shoulders">Shoulders (in)</Label>
                  <Input 
                    id="shoulders" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.shoulders}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="weight" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-fat">Body Fat %</Label>
                  <Input 
                    id="body-fat" 
                    type="number" 
                    step="0.1" 
                    placeholder="0.0" 
                    value={formData.bodyFat}
                    onChange={handleChange}
                  />
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
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={formData.date} 
                  onSelect={handleDateChange} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit">
              {type === "add" ? "Save New Measurement" : "Update Measurement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}