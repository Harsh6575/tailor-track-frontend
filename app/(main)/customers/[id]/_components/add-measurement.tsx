"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Customer } from "@/types";
import { defaultMeasurements, MeasurementType } from "@/lib/constants/measurements";
import apiClient from "@/lib/axios";
import { toast } from "sonner";

interface MeasurementFormValues {
  type: MeasurementType;
  name: string;
  notes?: string;
  data: { key: string; value: string }[];
}

export const AddMeasurementDialog = ({
  customer,
  onSave,
}: {
  customer: Customer;
  onSave?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<MeasurementFormValues>({
    defaultValues: {
      type: "shirt",
      name: "Shirt",
      notes: "",
      data: Object.entries(defaultMeasurements.shirt).map(([key, value]) => ({
        key,
        value,
      })),
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "data",
  });

  const selectedType = watch("type");

  // 🧠 Auto update fields & name based on type
  useEffect(() => {
    setValue("name", selectedType.charAt(0).toUpperCase() + selectedType.slice(1));
    replace(
      Object.entries(defaultMeasurements[selectedType]).map(([key, value]) => ({
        key,
        value,
      }))
    );
  }, [selectedType, replace, setValue]);

  // ✅ Handle submission (React 18-friendly)
  const onAddMeasurement = (values: MeasurementFormValues) => {
    startTransition(async () => {
      try {
        const dataObj = values.data.reduce(
          (acc, item) => {
            acc[item.key] = item.value;
            return acc;
          },
          {} as Record<string, string>
        );

        await apiClient.post("/customers/measurements", {
          customerId: customer.id,
          type: values.type,
          notes: values.notes || "",
          data: dataObj,
        });

        toast.success("Measurement added successfully");

        // Reset + close dialog + refresh parent
        reset();
        setOpen(false);
        onSave?.();
      } catch (err) {
        console.error(err);
        toast.error("Failed to add measurement");
      }
    });
  };

  const loading = isSubmitting || isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Measurement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Measurement</DialogTitle>
          <DialogDescription>
            Add a new measurement for <span className="font-semibold">{customer.fullName}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onAddMeasurement)} className="space-y-4">
            {/* Type Selection */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-4 mt-2"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shirt" id="shirt" />
                        <FormLabel htmlFor="shirt">Shirt</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pant" id="pant" />
                        <FormLabel htmlFor="pant">Pant</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Measurement Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Office Shirt" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Measurement Fields */}
            <div className="space-y-2">
              <FormLabel>Measurements Data</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`data.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Label (e.g., Chest)" disabled={loading} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`data.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Value (e.g., 40)" disabled={loading} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={loading || fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ key: "", value: "" })}
                disabled={loading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Adding..." : "Add Measurement"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
