"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Scissors, ClipboardList } from "lucide-react";

export const Main = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        queueMicrotask(() => {
          setUser(JSON.parse(storedUser));
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, [router]);

  const cards = [
    {
      title: "Customers",
      description: "Manage your customer list and details",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      onClick: () => router.push("/customers"),
    },
    {
      title: "Orders",
      description: "Track tailoring orders and deadlines",
      icon: <ClipboardList className="w-6 h-6 text-green-500" />,
      onClick: () => router.push("/orders"),
    },
    {
      title: "Measurements",
      description: "Store and access customer measurements",
      icon: <Scissors className="w-6 h-6 text-pink-500" />,
      onClick: () => router.push("/measurements"),
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center px-6 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || "Guest"} 👋</h1>
        <p className="text-gray-600 max-w-md">
          Manage your tailoring orders, customers, and measurements all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {cards.map((card) => (
          <Card
            key={card.title}
            onClick={card.onClick}
            className="cursor-pointer hover:shadow-lg transition-all"
          >
            <CardHeader className="flex flex-row items-center gap-3">
              {card.icon}
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};
