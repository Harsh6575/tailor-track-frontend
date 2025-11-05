"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import type { Customer } from "@/types";
import { CustomerOverview } from "./customer-overview";
import { MeasurementContainer } from "./measurements-container";

export function CustomerDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /**
   * Fetch single customer data
   */
  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    // setError(null);

    startTransition(async () => {
      try {
        const response = await apiClient.get(`/customers/${id}`);
        setCustomer(response.data.customer);
      } catch (err) {
        console.error(err);
        setError("Failed to load customer details.");
        toast.error("Failed to load customer details");
      }
    });
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  // Loading state (while fetching or transitioning)
  if (isPending && !customer)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        Loading customer...
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchCustomer}>Try Again</Button>
      </div>
    );

  // Not found
  if (!customer)
    return <div className="text-center text-muted-foreground py-12">Customer not found.</div>;

  return (
    <main className="container max-w-5xl mx-auto space-y-6 min-h-[80vh] py-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Customer Overview Section */}
      <CustomerOverview customer={customer} fetchCustomer={fetchCustomer} />

      {/* Measurements Section */}
      <MeasurementContainer customer={customer} fetchCustomer={fetchCustomer} />
    </main>
  );
}
