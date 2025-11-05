import { Customer } from "@/types";
import { MeasurementOverview } from "./measurement-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddMeasurementDialog } from "./add-measurement";

export const MeasurementContainer = ({
  customer,
  fetchCustomer,
}: {
  customer: Customer;
  fetchCustomer: () => void;
}) => {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg sm:text-2xl font-semibold">Measurements</CardTitle>

        <AddMeasurementDialog
          customerId={customer.id as string}
          customerName={customer.fullName}
          onSuccess={fetchCustomer}
        />
      </CardHeader>
      <CardContent>
        {customer.measurements?.length ? (
          <div className="space-y-4">
            {customer.measurements.map((m) => (
              <MeasurementOverview
                key={m.id}
                measurement={m}
                customer={customer}
                fetchCustomer={fetchCustomer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm sm:text-lg mb-2">No measurements yet</p>
            <p className="text-xs sm:text-sm">Click &#34;Add Measurement&#34; to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
