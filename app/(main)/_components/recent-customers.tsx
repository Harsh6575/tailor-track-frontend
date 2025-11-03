"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const dummyCustomers = [
  { name: "Raj Patel", phone: "9876543210", date: "30 Oct 2025" },
  { name: "Priya Shah", phone: "9820012345", date: "29 Oct 2025" },
  { name: "Amit Joshi", phone: "9812345678", date: "28 Oct 2025" },
  { name: "Kiran Mehta", phone: "9898765432", date: "26 Oct 2025" },
  { name: "Sneha Desai", phone: "9800012345", date: "25 Oct 2025" },
];

export const RecentCustomers = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Customers</CardTitle>
        <div className="space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/customers">View All</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/customers/new">Add New</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyCustomers.map((customer) => (
              <TableRow key={customer.phone}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
