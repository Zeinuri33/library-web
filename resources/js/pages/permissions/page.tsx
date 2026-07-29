"use client"

import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import { columns, Permission } from "./columns"
import { DataTable } from "@/components/data-table"
import CreatePermissionModal from "./create"
import EditPermissionModal from "./edit"
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

export default function Permissions({ permissions }: { permissions: Permission[] }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

  const selectedCount = Object.keys(rowSelection).length

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setOpenEdit(true)
  }

  const handleBulkDelete = () => {
    const selectedRows = Object.keys(rowSelection)
    const count = selectedRows.length
    selectedRows.forEach((index) => {
      const permission = permissions[Number(index)]
      if (permission) {
        router.delete(`/admin/permissions/${permission.id}`, { only: [] })
      }
    })
    toast(`${count} permission berhasil dihapus`)
    setRowSelection({})
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
                {permissions.length} permission
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
                    <AlertDialogTitle>Hapus Permission</AlertDialogTitle>
                    <AlertDialogDescription>
                      Yakin ingin menghapus <b>{selectedCount}</b> permission yang dipilih?
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
            <CreatePermissionModal />
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns(handleEdit)}
          data={permissions}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
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
      href: "/admin/permissions",
    },
  ],
}
