"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, PackageCheck, Scissors, CheckCircle } from "lucide-react";

export const DashboardCards = () => {
  const stats = [
    { title: "Total Customers", value: 24, icon: <Users className="w-6 h-6 text-blue-600" /> },
    {
      title: "Active Orders",
      value: 12,
      icon: <PackageCheck className="w-6 h-6 text-yellow-500" />,
    },
    {
      title: "Completed Orders",
      value: 32,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    },
    {
      title: "Measurements Saved",
      value: 58,
      icon: <Scissors className="w-6 h-6 text-pink-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item) => (
        <Card key={item.title} className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
