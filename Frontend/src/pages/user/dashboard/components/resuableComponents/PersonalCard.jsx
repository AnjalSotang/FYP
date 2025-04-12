import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateRecordsDialog } from "@/pages/user/dashboard/components/resuableComponents/update-records-dialog"
import { Dumbbell, Trash } from "lucide-react"
import { fetchPersonalRecords, setStatus, updatePersonalRecords, addPersonalRecord, deletePersonalRecord } from "../../../../../../store/personalRecordsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { Button } from "@/components/ui/button";

export function PersonalRecordsCard() {
  const { data: records, status } = useSelector((state) => state.personalRecord || {})
  const dispatch = useDispatch();
  const [operationType, setOperationType] = useState(null); // Track operation type: 'add', 'update', or 'delete'

  useEffect(() => {
    // Fetch data when component mounts
    dispatch(fetchPersonalRecords());
  }, [dispatch])

  // This function will handle both updates and new records
  const handleRecordsSubmission = async (recordsData) => {
    const { updatedRecords, newRecords } = recordsData;
    
    try {
      // Handle updates to existing records
      if (updatedRecords && updatedRecords.length > 0) {
        setOperationType('update');
        // Format records for API if needed
        const formattedUpdates = updatedRecords.map(record => ({
          id: record.id,
          excercise: record.exercise || record.excercise, // Handle both possible property names
          value: record.value,
          unit: record.unit,
          type: record.type
        }));
        
        // Dispatch update action
        await dispatch(updatePersonalRecords(formattedUpdates));
      }
      
      // Handle creation of new records
      if (newRecords && newRecords.length > 0) {
        setOperationType('add');
        
        // Create each new record individually or in batch
        for (const record of newRecords) {
          const formattedNewRecord = {
            excercise: record.exercise,
            value: record.value,
            unit: record.unit,
            type: record.type
          };
          
          // Dispatch action to add each new record
          await dispatch(addPersonalRecord(formattedNewRecord));
        }
        
        // Refresh records after adding new ones
        dispatch(fetchPersonalRecords());
      }
    } catch (error) {
      console.error('Error handling records:', error);
      toast.error("Failed to save records");
      setOperationType(null);
    }
  };

  const handleDeleteRecord = (recordId) => {
    // Set operation type before dispatching
    // console.log(recordId)
    setOperationType('delete');
    // Dispatch action to delete the record
    dispatch(deletePersonalRecord(recordId));
  };

  useEffect(() => {
    if (status?.status === "success") {
      // Show appropriate success message based on operation type
      if (operationType === 'update') {
        toast.success(status.message || "Records updated successfully");
      } else if (operationType === 'add') {
        toast.success(status.message || "Records added successfully");
      } else if (operationType === 'delete') {
        toast.success(status.message || "Record deleted successfully");
      }
      // Reset status and operation type
      dispatch(setStatus(null));
      setOperationType(null);
    }
    // else if (status?.status === "error") {
    //   console.log(status.message);
    //   toast.error(status.message);
    //   dispatch(setStatus(null));
    //   setOperationType(null);
    // }
  }, [status, dispatch, operationType])

  const hasRecords = records && records.length > 0;

  return (
    <>
      <Card>
        <ToastContainer />
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
        </CardHeader>
        <CardContent>
          {hasRecords ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{record.excercise}</div>
                      <div className="text-sm text-muted-foreground">{record.type}</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold flex items-center">
                    {record.value} {record.unit}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this record?")) {
                          handleDeleteRecord(record.id);
                        }
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <UpdateRecordsDialog 
                type="update" 
                UpdateRecords={handleRecordsSubmission} 
                initialRecords={records.map(record => ({
                  id: record.id,
                  exercise: record.excercise, // Map from excercise to exercise for component consistency
                  value: record.value,
                  unit: record.unit,
                  type: record.type
                }))} 
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No personal records yet</p>
              <UpdateRecordsDialog 
                type="add" 
                UpdateRecords={handleRecordsSubmission}
                initialRecords={[]} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}