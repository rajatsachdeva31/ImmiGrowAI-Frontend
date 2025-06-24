"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideCard from "@/components/Sidecard";
import {
  Pie,
  PieChart,
  Cell,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  BarChart,
  YAxis,
  Bar,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  houseListings: number;
  carListings: number;
  noOfImmigrant: number;
  formattedData: { month: string; count: number }[];
  userTypeGraph: { userType: string; count: number }[];
  verificationPieChart: { label: string; value: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_API_URL;

  const services = ["Dashboard", "User List", "Verify Users"];
  const urls = [
    "/dashboard/admin",
    "/dashboard/admin/user-list",
    "/dashboard/admin/verify-users",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });
        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;
        if (!token) throw new Error("Invalid token");

        const response = await fetch(`${endpoint}api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch admin stats");

        const data = await response.json();

        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [endpoint]);

  if (loading) return <p className="p-6">Loading admin dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  // Prepare User Type data for Pie Chart
  const userTypeChartData =
    stats?.userTypeGraph?.length > 0
      ? stats.userTypeGraph.map((item, index) => ({
          name: item.userType || "Unknown",
          value: item.count || 0,
          fill: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"][
            index % 5
          ],
        }))
      : [];

  // Prepare Verified vs. Non-Verified Users data
  const registrationChartData =
    stats?.verificationPieChart?.length > 0
      ? stats.verificationPieChart.map((item, index) => ({
          name: item.label,
          value: item.value,
          fill: ["#34D399", "#ff5733"][index % 2], // blue for Verified, Red for Unverified
        }))
      : [];

  // Prepare Formatted Data for Line Chart (Monthly User Counts)
  const barChartData =
    stats?.formattedData?.length > 0 ? stats.formattedData : [];

  // Chart Configurations
  const userTypeChartConfig: ChartConfig = userTypeChartData.reduce(
    (acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    },
    {} as ChartConfig
  );

  const registrationChartConfig: ChartConfig = registrationChartData.reduce(
    (acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    },
    {} as ChartConfig
  );

  const barChartConfig: ChartConfig = {
    count: {
      label: "Users",
      color: "#3498db", // Blue color
    },
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Quick Links" urls={urls} />
      </div>

      {/* Main Content */}
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Admin Dashboard</h2>

          {/* Stats & Line Chart Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Total Users", value: stats?.totalUsers },
                { title: "Verified Users", value: stats?.verifiedUsers },
                { title: "Unverified Users", value: stats?.unverifiedUsers },
                { title: "Total Immigrants", value: stats?.noOfImmigrant },
                { title: "House Listings", value: stats?.houseListings },
                { title: "Car Listings", value: stats?.carListings },
              ].map((stat, index) => (
                <Card key={index} className="p-4 border rounded shadow">
                  <CardHeader>
                    <CardTitle>{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Users Added</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig}>
                  <BarChart data={barChartData} width={500} height={300}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={0} // Ensures all months are shown
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#3498db" barSize={40} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pie Charts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={userTypeChartConfig}>
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="name" />}
                    />
                    <Pie data={userTypeChartData} dataKey="value">
                      {userTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verified vs. Non-Verified Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={registrationChartConfig}>
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="name" />}
                    />
                    <Pie data={registrationChartData} dataKey="value">
                      {registrationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
