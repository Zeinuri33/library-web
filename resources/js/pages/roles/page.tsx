"use client"

import { useState } from "react"
import { Head, router } from '@inertiajs/react'
import { columns, Role } from "./columns"
import { DataTable } from "@/components/data-table"
import CreateRoleModal from "./create"
import EditRoleModal from "./edit"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function Roles({ roles }: { roles: Role[] }) {

  const [openEdit, setOpenEdit] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const selectedCount = Object.keys(rowSelection).length

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setOpenEdit(true)
  }

  const handleBulkDelete = () => {
    const selectedRows = Object.keys(rowSelection)
    const count = selectedRows.length
    selectedRows.forEach((index) => {
      const role = roles[Number(index)]
      if (role) {
        router.delete(`/roles/${role.id}`, { only: [] })
      }
    })
    toast(`${count} role berhasil dihapus`)
    setRowSelection({})
  }

  return (
    <>
      <Head title="Role" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight ">
              Daftar Role
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-foreground">
                {roles.length} role, {[...new Set(roles.flatMap((r) => r.permissions.map((p) => p.name)))].length} permission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    <Trash2 className="h-4 w-4" />
                    Hapus ({selectedCount})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Role</AlertDialogTitle>
                    <AlertDialogDescription>
                      Yakin ingin menghapus <b>{selectedCount}</b> role yang dipilih?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <CreateRoleModal />
          </div>
        </div>

        {/* Table */}
        <DataTable 
          columns={columns(handleEdit)} 
          data={roles} 
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
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
