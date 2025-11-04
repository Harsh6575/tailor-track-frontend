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
import { Loader2 } from "lucide-react";
import { MeasurementBuilder } from "@/components/measurement-builder";

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

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add New Customer" : "Add Measurements (Optional)"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <span className="text-sm text-destructive">{errors.fullName.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" {...register("phone")} placeholder="10 digit number" />
                {errors.phone && (
                  <span className="text-sm text-destructive">{errors.phone.message}</span>
                )}
              </div>

              <div className="flex justify-between gap-3 pt-3">
                <Button type="submit" variant="outline" disabled={loading}>
                  {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                  Save Without Measurements
                </Button>
                <Button
                  type="button"
                  onClick={() => {
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
                  Next: Add Measurements
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <MeasurementBuilder
                control={control}
                fields={fields}
                append={append}
                remove={remove}
                watch={watch}
                setValue={setValue}
                register={register}
                fieldPrefix="measurements"
              />

              <div className="flex justify-between pt-4 border-t">
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
