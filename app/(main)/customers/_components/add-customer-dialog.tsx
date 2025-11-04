"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

/**
 * Default measurement templates
 */
const defaultMeasurements = {
  shirt: {
    top_length: "",
    chest: "",
    sleeve: "",
    shoulder: "",
    waist: "",
    neck: "",
  },
  pant: {
    bottom_length: "",
    hip: "",
    ankles: "",
    thighs: "",
    rise: "",
    knee: "",
  },
} as const;

/**
 * Zod schema
 */
const measurementSchema = z.object({
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
  data: z.record(z.string(), z.string().optional()).optional(),
});

const customerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  email: z.string().email().optional().or(z.literal("")),
  gender: z.string().optional(),
  address: z.string().optional(),
  measurements: z.array(measurementSchema).optional(),
});

type CustomerForm = z.infer<typeof customerSchema>;

export const AddCustomerDialog = ({ onCustomerAdded }: { onCustomerAdded?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      // email: "",
      // gender: "",
      // address: "",
      measurements: [],
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "measurements",
  });

  const onSubmit = async (data: CustomerForm) => {
    setLoading(true);
    console.log("Form data:", data);
    try {
      // Send full payload to your endpoint (adjust endpoint if needed)
      await apiClient.post("/customers/with-measurements", data);
      toast.success("Customer created successfully!");
      reset();
      onCustomerAdded?.();
      setOpen(false);
      setStep(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  // helper: add a measurement card for a garment type with default data
  const addMeasurementOfType = (type: "shirt" | "pant") => {
    const template = defaultMeasurements[type];
    append({
      type,
      notes: "",
      data: { ...template },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setStep(1);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Customer</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Add New Customer" : "Add Measurements"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <span className="text-sm text-red-500">{errors.fullName.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" {...register("phone")} placeholder="10 digit number" />
                {errors.phone && (
                  <span className="text-sm text-red-500">{errors.phone.message}</span>
                )}
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  type="button"
                  onClick={() => {
                    // basic validation on required top-level fields before next
                    const vals = form.getValues();
                    if (!vals.fullName || vals.fullName.length < 2) {
                      toast.error("Please enter a valid name (at least 2 characters)");
                      return;
                    }
                    if (!vals.phone || vals.phone.length !== 10 || !/^[0-9]+$/.test(vals.phone)) {
                      toast.error("Please enter a valid 10-digit phone number");
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {/* Buttons to add a Shirt or Pant card */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMeasurementOfType("shirt")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Shirt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addMeasurementOfType("pant")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Pant
                </Button>
              </div>

              {/* Render each measurement card */}
              <div className="space-y-4">
                {fields.map((field, index) => {
                  // watch the type so it is editable and kept in form state
                  const typeValue = watch(`measurements.${index}.type`) as string | undefined;
                  const dataValue = watch(`measurements.${index}.data`) as
                    | Record<string, string>
                    | undefined;

                  // if data is undefined but type matches our template, ensure data exists
                  if (
                    (!dataValue || Object.keys(dataValue).length === 0) &&
                    (typeValue === "shirt" || typeValue === "pant")
                  ) {
                    // populate default data for the type (only if empty)
                    setValue(`measurements.${index}.data`, {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ...(defaultMeasurements as any)[typeValue],
                    });
                  }

                  const dataKeys = dataValue ? Object.keys(dataValue) : [];

                  return (
                    <div key={field.id} className="p-3 border rounded-lg space-y-3 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => remove(index)}
                        aria-label={`Remove measurement ${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <Label>Type</Label>
                          <Input
                            {...register(`measurements.${index}.type`)}
                            placeholder="e.g. shirt, pant"
                          />
                        </div>

                        <div className="grid gap-1">
                          <Label>Notes</Label>
                          <Input
                            {...register(`measurements.${index}.notes`)}
                            placeholder="Notes (optional)"
                          />
                        </div>
                      </div>

                      {/* Render measurement fields dynamically based on data keys */}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {dataKeys.length > 0 ? (
                          dataKeys.map((key) => (
                            <div key={key} className="grid gap-1">
                              <Label htmlFor={`measurements.${index}.data.${key}`}>
                                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Label>
                              <Input
                                id={`measurements.${index}.data.${key}`}
                                {...register(`measurements.${index}.data.${key}`)}
                                placeholder="Enter value"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-sm text-muted-foreground">
                            No predefined measurement fields — you can edit the type to
                            `&#34;`shirt`&#34;` or `&#34;`pant`&#34;` to auto-populate fields, or
                            add keys programmatically.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
                    </>
                  ) : (
                    "Save Customer"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
