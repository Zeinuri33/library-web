"use client"

import { useState } from "react"
import { Head } from "@inertiajs/react"
import { columns, Permission } from "./columns"
import { DataTable } from "@/components/data-table"
import CreatePermissionModal from "./create"
import EditPermissionModal from "./edit"

export default function Permissions({ permissions }: { permissions: Permission[] }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setOpenEdit(true)
  }

  return (
    <>
      <Head title="Permission" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight ">
              Daftar Permission
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-foreground">
                Daftar permission sistem
              </p>
            </div>
          </div>

          <CreatePermissionModal />
        </div>

        {/* Table */}
        <DataTable
          columns={columns(handleEdit)}
          data={permissions}
        />

        {/* Modal Edit */}
        {selectedPermission && (
          <EditPermissionModal
            open={openEdit}
            setOpen={setOpenEdit}
            permission={selectedPermission}
          />
        )}
      </div>
    </>
  )
}

Permissions.layout = {
  breadcrumbs: [
    {
      title: "Permission",
      href: "/permissions",
    },
  ],
}