import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Loader2, Phone, Save, Trash2, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axios";
import { formatDate } from "@/lib/format-date";
import { Customer } from "@/types";
import { customerSchema, CustomerFormValues } from "@/lib/validations/customer";

interface CustomerOverviewProps {
  customer: Customer;
  fetchCustomer: () => void;
}

export const CustomerOverview = ({ customer, fetchCustomer }: CustomerOverviewProps) => {
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: customer.fullName,
      phone: customer.phone,
    },
  });

  useEffect(() => {
    if (customer) {
      customerForm.reset({
        fullName: customer.fullName,
        phone: customer.phone,
      });
    }
  }, [customer, customerForm]);

  const onDeleteCustomer = async () => {
    setActionLoading(true);
    try {
      await apiClient.delete(`/customers/${customer.id}`);
      toast.success("Customer deleted successfully");
      router.push("/customers");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
    } finally {
      setActionLoading(false);
    }
  };

  const onUpdateCustomer = async (values: CustomerFormValues) => {
    setActionLoading(true);
    try {
      await apiClient.put(`/customers/${customer.id}`, values);
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

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl sm:text-3xl font-bold tracking-tight">
            {customer.fullName}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Joined {formatDate(customer.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">
          {!isEditingCustomer ? (
            <>
              <Button variant="outline" size="icon" onClick={() => setIsEditingCustomer(true)}>
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
                type="submit"
                size="icon"
                disabled={actionLoading}
                onClick={customerForm.handleSubmit(onUpdateCustomer)}
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

      <CardContent className={`space-y-4`}>
        {isEditingCustomer ? (
          <Form {...customerForm}>
            <form onSubmit={customerForm.handleSubmit(onUpdateCustomer)} className="space-y-4">
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
          <div className="flex items-center gap-3 text-sm sm:text-lg">
            <Phone className="h-3 sm:h-5 w-3 sm:w-5 text-primary" />
            <a href={`tel:${customer.phone}`} className="font-medium hover:text-primary">
              {customer.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
