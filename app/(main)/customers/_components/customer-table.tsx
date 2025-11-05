"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axios";
import { Customer } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AddCustomerDialog } from "./add-customer-dialog";
import { useRouter } from "next/navigation";

export const CustomerTable = () => {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // 🔁 Fetch customers from backend
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get("/customers", {
        params: { page, limit: pagination.limit, search: searchQuery.trim() || undefined },
      });

      const data = response.data;
      setCustomers(data.customers || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, pagination.limit, searchQuery]);

  // 🔁 Fetch customers on mount and whenever filters change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ⏳ Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      fetchCustomers();
    }, 500); // debounce delay (0.5s)

    return () => clearTimeout(timeout);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRowClick = (id: string) => {
    router.push(`/customers/${id}`);
  };

  const handleAddCustomer = () => {
    fetchCustomers();
  };

  const goToPreviousPage = () => setPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setPage((p) => Math.min(p + 1, pagination.totalPages));
  const goToPage = (pageNum: number) =>
    setPage(Math.max(1, Math.min(pageNum, pagination.totalPages)));

  // 🌀 Loading
  if (loading && !customers.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading customers...</span>
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchCustomers}>Try Again</Button>
      </div>
    );
  }

  // 🧍 Empty state
  if (!customers.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No customers found</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery
              ? "Try searching with a different name or phone number"
              : "Get started by adding your first customer"}
          </p>
        </div>
        <AddCustomerDialog onCustomerAdded={handleAddCustomer} />
      </div>
    );
  }

  // Pagination display numbers
  const getPageNumbers = () => {
    const { totalPages } = pagination;
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Top Bar: Search + Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <AddCustomerDialog onCustomerAdded={handleAddCustomer} />
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>All registered customers</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, idx) => (
              <TableRow key={customer.id} className="cursor-pointer">
                <TableCell>{(pagination.page - 1) * pagination.limit + idx + 1}</TableCell>
                <TableCell
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() => handleRowClick(customer.id)}
                >
                  {customer.fullName}
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={idx}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(p as number)}
                  className="w-10"
                >
                  {p}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={page === pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
