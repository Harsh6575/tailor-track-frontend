import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditMeasurementDialog } from "./edit-measurement";
import { Button } from "@/components/ui/button";
import { Edit2, Loader2, Printer, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { printMeasurement } from "@/lib/print-measurement";
import { formatDate } from "@/lib/format-date";
import { Customer, Measurements } from "@/types";
import { useState } from "react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

export const MeasurementOverview = ({
  customer,
  measurement,
  fetchCustomer,
}: {
  customer: Customer;
  measurement: Measurements;
  fetchCustomer: () => void;
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  const onDeleteMeasurement = async (measurementId: string) => {
    setActionLoading(true);
    try {
      await apiClient.delete(`/customers/measurements/${measurementId}`);
      toast.success("Measurement deleted successfully");
      fetchCustomer();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete measurement");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card key={measurement.id} className="border hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg font-semibold">{measurement.type}</CardTitle>
          {measurement.notes && (
            <p className="text-sm text-muted-foreground mt-1">{measurement.notes}</p>
          )}
        </div>
        <div className="flex gap-2">
          <EditMeasurementDialog
            measurement={measurement}
            customerName={customer.fullName}
            onSuccess={fetchCustomer}
            trigger={
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Edit2 className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Measurement?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {measurement.type} measurement. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteMeasurement(measurement.id)}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={actionLoading}
                >
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button className="" onClick={() => printMeasurement(customer, measurement)}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(measurement.data).map(([key, value]) => (
            <div key={key} className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{key}</p>
              <p className="text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-2 mt-3">
          <span className="text-sm font-medium text-muted-foreground">Last Updated:</span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(measurement.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
