"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DynamicColumnDef } from "@/components/data-table/data-table-dynamic/types/column.types"
import { DynamicDataTable } from "@/components/data-table/data-table-dynamic/core/dynamic-data-table"

// 1. Define Data Type matching your provided data
type User = {
  id: string
  email: string
  name: string
  image: string
  role_id: string
  password?: string
  role: { name: string; description: string }
  email_verified: boolean
  created_at: string
}

// 2. Initial Data
const usersData: User[] = [
  {
    id: "1",
    email: "alice@example.com",
    name: "Alice Johnson",
    image: "https://i.pravatar.cc/150?img=32",
    role_id: "role_admin",
    password: "hashedpassword1",
    role: { name: "Admin", description: "Administrator role" },
    email_verified: true,
    created_at: "2023-07-01T00:00:00.000Z",
  },
  {
    id: "2",
    email: "bob@example.com",
    name: "Bob Martin",
    image: "https://i.pravatar.cc/150?img=12",
    role_id: "role_user",
    password: "hashedpassword2",
    role: { name: "User", description: "Regular user role" },
    email_verified: true,
    created_at: "2023-07-02T00:00:00.000Z",
  },
  {
    id: "3",
    email: "carla@example.com",
    name: "Carla Gomez",
    image: "https://i.pravatar.cc/150?img=45",
    role_id: "role_manager",
    password: "hashedpassword3",
    role: { name: "Manager", description: "Manager role" },
    email_verified: false,
    created_at: "2023-07-03T00:00:00.000Z",
  },
  {
    id: "4",
    email: "daniel@example.com",
    name: "Daniel Lee",
    image: "https://i.pravatar.cc/150?img=7",
    role_id: "role_user",
    password: "hashedpassword4",
    role: { name: "User", description: "Regular user role" },
    email_verified: true,
    created_at: "2023-07-04T00:00:00.000Z",
  },
  {
    id: "5",
    email: "eva@example.com",
    name: "Eva Schultz",
    image: "https://i.pravatar.cc/150?img=18",
    role_id: "role_support",
    password: "hashedpassword5",
    role: { name: "Support", description: "Support role" },
    email_verified: false,
    created_at: "2023-07-05T00:00:00.000Z",
  },
]

// 3. Columns Configuration
const columns: DynamicColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "",
    displayMode: "avatar",
    imageSize: "md",
    imageAltKey: "name",
    enableSorting: false,
    size: 50,
  },
  {
    accessorKey: "name",
    header: "Full Name",
    editable: true,
    inputType: "text",
  },
  {
    accessorKey: "email",
    header: "Email",
    editable: true,
    inputType: "text",
  },
  {
    // Accessing Nested Data (role.name)
    accessorKey: "role.name",
    header: "Role",
    editable: true,
    inputType: "select",
    // Note: In a real app, you might want to update role_id when this changes
    selectOptions: [
      { label: "Admin", value: "Admin" },
      { label: "User", value: "User" },
      { label: "Manager", value: "Manager" },
      { label: "Support", value: "Support" },
      
    ],
    filterOptions: [
      { label: "Admin", value: "Admin" },
      { label: "User", value: "User" },
      { label: "Manager", value: "Manager" },
    ]
  },
  {
    accessorKey: "email_verified",
    header: "Verified",
    // Custom Badge Logic for Boolean
    cell: ({ getValue }) => {
      const isVerified = getValue() as boolean
      return (
        <Badge variant={isVerified ? "default" : "secondary"}>
          {isVerified ? "Verified" : "Pending"}
        </Badge>
      )
    },
    // Optional: Make it editable via select (True/False)
    editable: true,
    inputType: "select",
    selectOptions: [
      { label: "Verified", value: true },
      { label: "Pending", value: false }
    ]
    
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    editable: true,
    inputType: "datepicker",
    dateFormat: "MMM dd, yyyy",
  },
]

export default function DataTableDynamic() {
  const [data, setData] = React.useState<User[]>(usersData)

  // 1. Handle Saving Changes
  // This is triggered by the "Save Changes" button in the toolbar
  const handleSave = (updatedData: User[]) => {
    console.log("Saving data to backend...", updatedData)
    
    // Simulate API Call
    setTimeout(() => {
      setData(updatedData) // Update the "Clean" state (which hides the Save button)
      toast.success("Changes saved successfully!")
    }, 500)
  }

  // 2. Handle Batch Delete
  const handleDeleteSelected = (selectedRows: User[]) => {
    const selectedIds = new Set(selectedRows.map((user) => user.id))
    const remaining = data.filter((user) => !selectedIds.has(user.id))

    setData(remaining)
    toast.success("Users deleted")
  }

  // 3. Row Actions
  const handleView = (row: User) =>
    toast.info(`Viewing details for ${row.name}`)
  const handleEdit = (row: User) =>
    toast.info(`Edit action clicked for ${row.name}`)
  const handleDelete = (row: User) => {
    setData((prev) => prev.filter((user) => user.id !== row.id))
    toast.success(`${row.name} deleted`)
  }

  // 4. Add Row
  const handleAddRow = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Member",
      email: "new@example.com",
      image: "",
      role_id: "role_user",
      role: { name: "User", description: "Regular user" },
      email_verified: false,
      created_at: new Date().toISOString(),
    }
    setData([newUser, ...data])
  }

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-xl border bg-card shadow-sm">
        <DynamicDataTable<User>
          data={data}
          columnConfig={columns}
          rowIdKey="id"
          
          // Layout Config
          toolbarTitle="User Management"
          toolbarSubtitle="View and manage system access and permissions."
          
          // Features
          enableRowDrag
          enableRowSelection
          enableColumnVisibility
          enableGlobalFilter
          viewMode="comfortable"
          isLoading={false}
          
          
          // Events
          onSave={handleSave}
          onDeleteSelected={handleDeleteSelected}
          onAddRow={handleAddRow} // Toolbar "Add" button
          onViewRow={handleView}
          onEditRow={handleEdit}
          onDeleteRow={handleDelete}
        />
      </div>

      {/* Debug: View Raw Data */}
      <div className="mt-8 rounded border bg-card p-4 font-mono text-xs text-card-foreground">
        <p className="mb-2 font-bold text-primary">Current Data State:</p>
        <pre>{JSON.stringify(data.map(u => ({ name: u.name, role: u.role.name, verified: u.email_verified })), null, 2)}</pre>
      </div>
    </div>
  )
}
