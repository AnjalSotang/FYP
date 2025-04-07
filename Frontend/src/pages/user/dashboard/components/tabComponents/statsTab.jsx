// StatsTab.jsx - Fixed with error handling and toast notifications
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { User, Plus, PenLine } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { AddMeasurementsDialog } from "../resuableComponents/add-measurements-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeasurements, setStatus } from "../../../../../../store/measurementSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

export function StatsTab() {
  const dispatch = useDispatch();
  const { data: measurements, status } = useSelector((state) => state.measurement || {});
  const [operationType, setOperationType] = useState(null); // Track operation type: 'add', 'update', or 'delete'

  useEffect(() => {
    // Fetch measurements when component mounts
    dispatch(fetchMeasurements());
  }, [dispatch]);

  useEffect(() => {
    if (status?.status === "success") {
      // Show appropriate success message based on operation type
      if (operationType === 'update') {
        toast.success(status.message || "Measurements updated successfully");
      } else if (operationType === 'add') {
        toast.success(status.message || "Measurements added successfully");
      } else if (operationType === 'delete') {
        toast.success(status.message || "Measurement deleted successfully");
      }
      // Reset status and operation type
      dispatch(setStatus(null));
      setOperationType(null);
    }
    else if (status?.status === "error") {
      console.log(status.message);
      toast.error(status.message || "An error occurred");
      dispatch(setStatus(null));
      setOperationType(null);
    }
  }, [status, dispatch, operationType]);

  // Define handler function to set operation type for AddMeasurementsDialog
  const handleMeasurementOperation = (type) => {
    setOperationType(type);
  };

  const hasMeasurements = measurements && measurements.length > 0;
  const latest = hasMeasurements ? measurements[measurements.length - 1] : null;
  const previous = measurements && measurements.length > 1 ? measurements[measurements.length - 2] : null;

  const measurementFields = [
    { key: "weight", label: "Weight", unit: "lbs", improveIf: "down" },
    { key: "bodyFat", label: "Body Fat", unit: "%", improveIf: "down" },
    { key: "chest", label: "Chest", unit: "in", improveIf: "up" },
    { key: "waist", label: "Waist", unit: "in", improveIf: "down" },
    { key: "arms", label: "Arms", unit: "in", improveIf: "up" },
  ];

  const getChange = (key) => {
    if (!latest || !previous) return null;

    const current = parseFloat(latest[key]);
    const prev = parseFloat(previous[key]);
    if (isNaN(current) || isNaN(prev)) return null;

    const diff = current - prev;
    return {
      value: Math.abs(diff).toFixed(1),
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "same",
    };
  };

  return (
    <Card>
      <ToastContainer />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Body Measurements</CardTitle>
        {hasMeasurements && (
          <AddMeasurementsDialog 
            type="add" 
            className="ml-auto"
            onBeforeSubmit={() => handleMeasurementOperation('add')}
          >
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          </AddMeasurementsDialog>
        )}
      </CardHeader>

      <CardContent>
        {!hasMeasurements ? (
          <div className="text-center py-8">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-6">
              No measurements recorded yet. Start tracking your progress by adding your first measurement.
            </p>
            <AddMeasurementsDialog 
              type="add"
              onBeforeSubmit={() => handleMeasurementOperation('add')}
            >
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add First Measurement
              </Button>
            </AddMeasurementsDialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Latest measurements from {format(new Date(latest.date), "MMMM d, yyyy")}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Measurement</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurementFields.map(({ key, label, unit, improveIf }) =>
                  latest[key] ? (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>{latest[key]} {unit}</TableCell>
                      <TableCell>
                        {previous && getChange(key) && (
                          <span
                            className={
                              getChange(key).direction === improveIf
                                ? "text-green-600"
                                : getChange(key).direction !== "same"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {getChange(key).direction === "down" ? "↓" : getChange(key).direction === "up" ? "↑" : ""}
                            {getChange(key).value} {unit}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : null
                )}
              </TableBody>
            </Table>

            {hasMeasurements && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Track your progress by adding new measurements regularly.
                </p>
                <AddMeasurementsDialog 
                  type="update" 
                  data={measurements}
                  onBeforeSubmit={() => handleMeasurementOperation('update')}
                >
                  <Button size="sm" className="gap-1">
                    <PenLine className="h-4 w-4" /> Edit Latest
                  </Button>
                </AddMeasurementsDialog>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}