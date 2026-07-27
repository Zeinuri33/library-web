"use client"

import { useState } from "react"
import { Head } from '@inertiajs/react'
import { columns, Role } from "./columns"
import { DataTable } from "@/components/data-table"
import CreateRoleModal from "./create"
import EditRoleModal from "./edit"

export default function Roles({ roles }: { roles: Role[] }) {

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setOpenEdit(true)
  }

  return (
    <>
      <Head title="Role" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary">
              Data Role
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-foreground">
                Daftar role dan permission
              </p>
            </div>
          </div>

          <CreateRoleModal />
        </div>

        {/* Table */}
        <DataTable 
          columns={columns(handleEdit)} 
          data={roles} 
        />

        {/* Modal Edit */}
        {selectedRole && (
          <EditRoleModal
            open={openEdit}
            setOpen={setOpenEdit}
            role={selectedRole}
          />
        )}

      </div>
    </>
  )
}

Roles.layout = {
  breadcrumbs: [
    {
      title: 'Role',
      href: '/roles',
    },
  ],
}