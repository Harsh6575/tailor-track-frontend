import { Metadata } from "next";
import { CustomerDetails } from "./_components/customer-details";

export const metadata: Metadata = {
  title: "Customer Details Page",
  description: "Customer Details Page",
};

export default function CustomerIdPage() {
  return <CustomerDetails />;
}
