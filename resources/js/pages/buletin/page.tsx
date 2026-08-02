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
import CreateBuletinModal from "./create"
import type { Buletin } from "./edit"
import EditBuletinModal from "./edit"

export default function BuletinPage({
    buletins,
}: {
    buletins: Buletin[]
}) {
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedBuletin, setSelectedBuletin] = useState<Buletin | null>(null)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleEdit = (buletin: Buletin) => {
        setSelectedBuletin(buletin)
        setOpenEdit(true)
    }

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const buletin = buletins[Number(index)]

            if (buletin) {
                router.delete(`/admin/buletin/${buletin.id}`, { only: [] })
            }
        })
        toast(`${count} buletin berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Buletin" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Buletin
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {buletins.length} buletin
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
                                            Hapus Buletin
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> buletin yang
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
                        <CreateBuletinModal />
                    </div>
                </div>

                <DataTable
                    columns={columns(handleEdit)}
                    data={buletins}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                {selectedBuletin && (
                    <EditBuletinModal
                        open={openEdit}
                        setOpen={setOpenEdit}
                        buletin={selectedBuletin}
                    />
                )}
            </div>
        </>
    )
}

BuletinPage.layout = {
    breadcrumbs: [
        {
            title: "Buletin",
            href: "/admin/buletin",
        },
    ],
}
