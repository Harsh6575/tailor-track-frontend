"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MeasurementBuilder } from "@/components/measurement-builder";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";

type Measurement = {
  id: string;
  type: string;
  notes: string;
  data: Record<string, string>;
};

type MeasurementData = {
  type: string;
  notes?: string;
  data: Record<string, string>;
};

type EditMeasurementDialogProps = {
  measurement: Measurement;
  customerName: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const EditMeasurementDialog = ({
  measurement,
  customerName,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EditMeasurementDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    type: measurement.type,
    notes: measurement.notes,
    data: measurement.data,
  });

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Reset data when measurement changes or dialog opens
  useEffect(() => {
    if (open) {
      setMeasurementData({
        type: measurement.type,
        notes: measurement.notes,
        data: { ...measurement.data },
      });
    }
  }, [open, measurement]);

  const handleSubmit = async () => {
    // Validation
    if (!measurementData.type.trim()) {
      toast.error("Please enter a measurement type");
      return;
    }

    if (Object.keys(measurementData.data).length === 0) {
      toast.error("Please add at least one measurement field");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put(`/customers/measurements/${measurement.id}`, {
        type: measurementData.type,
        notes: measurementData.notes || "",
        data: measurementData.data,
      });
      toast.success("Measurement updated successfully");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update measurement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Measurement</DialogTitle>
          <DialogDescription>Update measurement details for {customerName}</DialogDescription>
        </DialogHeader>

        <MeasurementBuilder
          singleMode
          singleData={measurementData}
          onSingleDataChange={setMeasurementData}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Measurement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
