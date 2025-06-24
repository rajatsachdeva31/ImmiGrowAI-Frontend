"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideCard from "@/components/Sidecard";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type UnverifiedUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  DOB: string;
  firebaseUid: string;
  userVerified: boolean;
  statusInCanada: string | null;
  roleId: number;
  userDocuments: { id: string }[];
};

export default function VerifyUsersPage() {
  const [users, setUsers] = useState<UnverifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const endpoint = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const services = ["Dashboard", "User List", "Verify Users"];
  const urls = [
    "/dashboard/admin",
    "/dashboard/admin/user-list",
    "/dashboard/admin/verify-users",
  ];

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const tokenResponse = await fetch(`${endpoint}auth/token`, {
          credentials: "include",
        });

        if (!tokenResponse.ok)
          throw new Error("Failed to get authentication token");

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) throw new Error("Invalid token");

        const response = await fetch(
          `${endpoint}api/admin/verify/unverified-user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        if (response.status === 404) {
          setError("No unverified users found");
        }

        const extractedUsers = data?.user ?? [];
        if (!Array.isArray(extractedUsers)) {
          throw new Error(
            `Unexpected API response format: ${JSON.stringify(data, null, 2)}`
          );
        }

        setUsers(extractedUsers);
      } catch (err: any) {
        console.error("Error fetching unverified users:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedUsers();
  }, [endpoint]);

  const columns: ColumnDef<UnverifiedUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "phoneNo",
      header: "Phone Number",
      cell: ({ row }) => <div>{row.getValue("phoneNo")}</div>,
    },
    {
      accessorKey: "DOB",
      header: "Date of Birth",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("DOB")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "statusInCanada",
      header: "Status in Canada",
      cell: ({ row }) => <div>{row.getValue("statusInCanada") || "N/A"}</div>,
    },
    {
      accessorKey: "userVerified",
      header: "Verified",
      cell: ({ row }) => (
        <div
          className={`font-bold ${
            row.getValue("userVerified") ? "text-blue-600" : "text-red-600"
          }`}
        >
          {row.getValue("userVerified") ? "Yes" : "No"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/admin/view-user/${user.id}`)
                }
              >
                View User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="grid grid-cols-12 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-12 md:col-span-3 mt-3 p-3">
        <SideCard services={services} title="Admin Links" urls={urls} />
      </div>

      {/* Main Content */}
      <div className="col-span-12 md:col-span-9 p-5">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 mt-4">Non-Verified Users</h2>

          {loading && <p className="text-gray-500">Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              {/* Search by Name */}
              <div className="flex items-center py-4">
                <Input
                  placeholder="Search by Name..."
                  value={
                    (table.getColumn("fullName")?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("fullName")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              </div>

              {/* User Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="text-center py-6"
                        >
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
