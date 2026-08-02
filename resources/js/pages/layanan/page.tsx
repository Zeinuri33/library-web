"use client"

import { Head, router } from "@inertiajs/react"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table"
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
import { Button } from "@/components/ui/button"
import { columns } from "./columns"
import CreateLayananModal from "./create"
import type { Layanan } from "./edit"
import EditLayananModal from "./edit"
import type { JenisLayananOption } from "./layanan-form"

export default function LayananPage({
    layanans,
    jenisLayanans,
}: {
    layanans: Layanan[]
    jenisLayanans: JenisLayananOption[]
}) {
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleEdit = (layanan: Layanan) => {
        setSelectedLayanan(layanan)
        setOpenEdit(true)
    }

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const layanan = layanans[Number(index)]

            if (layanan) {
                router.delete(`/admin/layanan/${layanan.id}`, { only: [] })
            }
        })
        toast(`${count} layanan berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Layanan" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Layanan
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {layanans.length} layanan
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
                                        <AlertDialogTitle>
                                            Hapus Layanan
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> layanan yang
                                            dipilih?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleBulkDelete}
                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        >
                                            Hapus
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <CreateLayananModal jenisLayanans={jenisLayanans} />
                    </div>
                </div>

                <DataTable
                    columns={columns(handleEdit)}
                    data={layanans}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                {selectedLayanan && (
                    <EditLayananModal
                        open={openEdit}
                        setOpen={setOpenEdit}
                        layanan={selectedLayanan}
                        jenisLayanans={jenisLayanans}
                    />
                )}
            </div>
        </>
    )
}

LayananPage.layout = {
    breadcrumbs: [
        {
            title: "Layanan",
            href: "/admin/layanan",
        },
    ],
}
