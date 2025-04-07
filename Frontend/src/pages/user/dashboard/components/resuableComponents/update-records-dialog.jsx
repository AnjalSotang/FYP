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
import { Dumbbell, Plus } from "lucide-react"
import { useEffect } from "react";

export function UpdateRecordsDialog({ type, UpdateRecords, initialRecords = [] }) {
  const [open, setOpen] = useState(false)
  const [records, setRecords] = useState(initialRecords || []);
  const [newRecord, setNewRecord] = useState({ exercise: "", value: "", unit: "lbs", type: "1 rep max" })
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Track which records are new vs existing
  const [newRecordIds, setNewRecordIds] = useState([]);
  
  // Update local records when initialRecords prop changes
  useEffect(() => {
    setRecords(initialRecords || []);
  }, [initialRecords]);

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Separate existing records from newly added records
    const updatedRecords = records.filter(record => !newRecordIds.includes(record.id));
    const createdRecords = records.filter(record => newRecordIds.includes(record.id));
    
    console.log("Records to update:", updatedRecords);
    console.log("New records to create:", createdRecords);
    
    // Send both types of records to parent component
    UpdateRecords({
      updatedRecords: updatedRecords,
      newRecords: createdRecords
    });
    
    // Reset tracking of new records
    setNewRecordIds([]);
    setOpen(false);
  }

  const handleRecordChange = (id, value) => {
    setRecords(records.map((record) => 
      record.id === id ? { ...record, value: Number.parseFloat(value) || 0 } : record
    ));
  }

  const handleAddRecord = () => {
    if (newRecord.exercise && newRecord.value) {
      // Generate a temporary client-side unique ID
      const newId = -Math.floor(Math.random() * 10000) - 1; // Negative ID to avoid conflicts with server IDs
      
      const formattedRecord = {
        id: newId,
        exercise: newRecord.exercise,
        value: parseFloat(newRecord.value) || 0,
        unit: newRecord.unit || "lbs",
        type: newRecord.type || "1 rep max",
      };
      
      // Add to local records
      setRecords([...records, formattedRecord]);
      
      // Track this as a new record
      setNewRecordIds([...newRecordIds, newId]);
      
      // Reset form
      setNewRecord({ exercise: "", value: "", unit: "lbs", type: "1 rep max" });
      setShowAddForm(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          {type === "update" ? "Update Records" : "Add Records"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type === "update" ? "Update Your Personal Records" : "Add Your Personal Records"}</DialogTitle>
          <DialogDescription>
            {type === "add" ? "Track your physical progress by recording your personal bests." : "Update & track your personal bests to monitor your progress."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 my-4">
            {records.map((record) => (
              <div key={record.id} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{record.exercise}</div>
                  <div className="text-sm text-muted-foreground">{record.type}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={record.value}
                    onChange={(e) => handleRecordChange(record.id, e.target.value)}
                    className="w-20"
                  />
                  <span>{record.unit}</span>
                </div>
              </div>
            ))}

            {showAddForm ? (
              <div className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise">Exercise</Label>
                  <Input
                    id="exercise"
                    value={newRecord.exercise}
                    onChange={(e) => setNewRecord({ ...newRecord, exercise: e.target.value })}
                    placeholder="e.g., Pull-ups"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    type="string"
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                    placeholder="e.g., 1 rep max or Repetitions"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newRecord.value}
                      onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newRecord.unit}
                      onChange={(e) => setNewRecord({ ...newRecord, unit: e.target.value })}
                      placeholder="lbs, kg, reps"
                    />
                  </div>
                </div>
               
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddRecord}>
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <Button type="button" variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Record
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">
              {records.length === 0 ? "Save Records" : 
               newRecordIds.length > 0 ? "Save All Records" : "Update Records"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}