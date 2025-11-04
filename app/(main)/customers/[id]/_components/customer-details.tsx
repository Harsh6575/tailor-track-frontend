"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowLeft, Phone, Edit2, Trash2, Save, X, Plus } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { Customer, Measurements } from "@/types";
import { defaultMeasurements } from "@/lib/constants/measurements";

// Validation Schemas
const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

const measurementSchema = z.object({
  type: z.string().min(1, "Type is required"),
  notes: z.string().optional(),
  data: z.array(
    z.object({
      key: z.string().min(1, "Key is required"),
      value: z.string().min(1, "Value is required"),
    })
  ),
});

export const CustomerDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editMeasurementId, setEditMeasurementId] = useState<string | null>(null);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Customer Form
  const customerForm = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  // Measurement Form
  const measurementForm = useForm<z.infer<typeof measurementSchema>>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      type: "",
      notes: "",
      data: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: measurementForm.control,
    name: "data",
  });

  // ✅ Auto-fill measurement fields when type changes
  useEffect(() => {
    const type = measurementForm.watch("type").toLowerCase();
    if (type === "shirt" || type === "pant") {
      const defaults = defaultMeasurements[type];
      const formatted = Object.entries(defaults).map(([key, value]) => ({
        key,
        value,
      }));
      replace(formatted);
    }
  }, [measurementForm.watch("type")]);

  // Fetch Customer
  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/customers/${id}`);
      setCustomer(response.data.customer);
      customerForm.reset({
        fullName: response.data.customer.fullName,
        phone: response.data.customer.phone,
      });
    } catch (err) {
      setError("Failed to load customer details.");
      console.error(err);
      toast.error("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update Customer
  const onUpdateCustomer = async (values: z.infer<typeof customerSchema>) => {
    setActionLoading(true);
    try {
      await apiClient.put(`/customers/${id}`, values);
      toast.success("Customer updated successfully");
      setIsEditingCustomer(false);
      fetchCustomer();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update customer");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Customer
  const onDeleteCustomer = async () => {
    setActionLoading(true);
    try {
      await apiClient.delete(`/customers/${id}`);
      toast.success("Customer deleted successfully");
      router.push("/customers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
      setActionLoading(false);
    }
  };

  // Add Measurement
  const onAddMeasurement = async (values: z.infer<typeof measurementSchema>) => {
    setActionLoading(true);
    try {
      const dataObj = values.data.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>
      );

      await apiClient.post("/customers/measurements", {
        customerId: id,
        type: values.type,
        notes: values.notes || "",
        data: dataObj,
      });
      toast.success("Measurement added successfully");
      setIsAddingMeasurement(false);
      measurementForm.reset();
      fetchCustomer();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add measurement");
    } finally {
      setActionLoading(false);
    }
  };

  // Update Measurement
  const onUpdateMeasurement = async (values: z.infer<typeof measurementSchema>) => {
    if (!editMeasurementId) return;
    setActionLoading(true);
    try {
      const dataObj = values.data.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>
      );

      await apiClient.put(`/customers/measurements/${editMeasurementId}`, {
        type: values.type,
        notes: values.notes || "",
        data: dataObj,
      });
      toast.success("Measurement updated successfully");
      setEditMeasurementId(null);
      measurementForm.reset();
      fetchCustomer();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update measurement");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Measurement
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

  // Open Edit Measurement
  const openEditMeasurement = (measurement: Measurements) => {
    setEditMeasurementId(measurement.id);
    const dataArray = Object.entries(measurement.data).map(([key, value]) => ({
      key,
      value,
    }));
    measurementForm.reset({
      type: measurement.type,
      notes: measurement.notes,
      data: dataArray,
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading customer...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchCustomer}>Try Again</Button>
      </div>
    );

  if (!customer)
    return <div className="text-center text-muted-foreground py-12">Customer not found.</div>;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Customer Overview */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">{customer.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditingCustomer ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditingCustomer(true)}
                  className="hover:bg-primary/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {customer.fullName} and all associated
                        measurements. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDeleteCustomer}
                        className="bg-destructive hover:bg-destructive/90"
                        disabled={actionLoading}
                      >
                        {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setIsEditingCustomer(false);
                    customerForm.reset({
                      fullName: customer.fullName,
                      phone: customer.phone,
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={customerForm.handleSubmit(onUpdateCustomer)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingCustomer ? (
            <Form {...customerForm}>
              <form className="space-y-4">
                <FormField
                  control={customerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <div className="flex items-center gap-3 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              <a
                href={`tel:+91${customer.phone}`}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {customer.phone}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurements Section */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-semibold">Measurements</CardTitle>
          <Dialog open={isAddingMeasurement} onOpenChange={setIsAddingMeasurement}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Measurement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Measurement</DialogTitle>
                <DialogDescription>Add a new measurement for {customer.fullName}</DialogDescription>
              </DialogHeader>
              <Form {...measurementForm}>
                <form
                  onSubmit={measurementForm.handleSubmit(onAddMeasurement)}
                  className="space-y-4"
                >
                  <FormField
                    control={measurementForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Shirt, Pant, Suit" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={measurementForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel>Measurements Data</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex gap-2">
                        <FormField
                          control={measurementForm.control}
                          name={`data.${index}.key`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Label (e.g., Chest)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={measurementForm.control}
                          name={`data.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="Value (e.g., 40)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
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
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Measurement
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {customer.measurements?.length ? (
            <div className="space-y-4">
              {customer.measurements.map((m) => (
                <Card key={m.id} className="border hover:border-primary/50 transition-colors">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-lg font-semibold">{m.type}</CardTitle>
                      {m.notes && <p className="text-sm text-muted-foreground mt-1">{m.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={editMeasurementId === m.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setEditMeasurementId(null);
                            measurementForm.reset();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditMeasurement(m)}
                            className="hover:bg-primary/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Measurement</DialogTitle>
                            <DialogDescription>
                              Update measurement details for {customer.fullName}
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...measurementForm}>
                            <form
                              onSubmit={measurementForm.handleSubmit(onUpdateMeasurement)}
                              className="space-y-4"
                            >
                              <FormField
                                control={measurementForm.control}
                                name="type"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Shirt, Pant, Suit" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={measurementForm.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Additional notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="space-y-2">
                                <FormLabel>Measurements Data</FormLabel>
                                {fields.map((field, index) => (
                                  <div key={field.id} className="flex gap-2">
                                    <FormField
                                      control={measurementForm.control}
                                      name={`data.${index}.key`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input placeholder="Label" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={measurementForm.control}
                                      name={`data.${index}.value`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1">
                                          <FormControl>
                                            <Input placeholder="Value" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => remove(index)}
                                      disabled={fields.length === 1}
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
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Field
                                </Button>
                              </div>
                              <DialogFooter>
                                <Button type="submit" disabled={actionLoading}>
                                  {actionLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Update Measurement
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
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
                              This will permanently delete the {m.type} measurement. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteMeasurement(m.id)}
                              className="bg-destructive hover:bg-destructive/90"
                              disabled={actionLoading}
                            >
                              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(m.data).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            {key}
                          </p>
                          <p className="text-sm font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No measurements yet</p>
              <p className="text-sm">Click &#34;Add Measurement&#34; to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};
