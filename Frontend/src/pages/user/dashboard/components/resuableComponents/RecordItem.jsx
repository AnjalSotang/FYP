import { Dumbbell } from "lucide-react";

export function RecordItem({ record }) {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{record.exercise}</div>
            <div className="text-sm text-muted-foreground">{record.type}</div>
          </div>
        </div>
        <div className="text-xl font-bold">{record.value}</div>
      </div>
    )
  }