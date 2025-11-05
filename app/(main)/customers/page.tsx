import { CustomerTable } from "./_components/customer-table";

export const metadata = {
  title: "Customers | Tailor Dashboard",
  description: "View and manage your customers",
};

export default function CustomersPage() {
  return (
    <div className="max-w-5xl mx-auto h-full w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>

      <CustomerTable />
    </div>
  );
}
