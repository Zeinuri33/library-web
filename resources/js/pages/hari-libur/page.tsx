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
import type { HariLibur } from "./columns"
import CreateHariLiburModal from "./create"
import EditHariLiburModal from "./edit"

type Lokasi = {
    id: number
    nama: string
}

export default function HariLiburPage({
    hariLiburs,
    lokasis,
}: {
    hariLiburs: HariLibur[]
    lokasis: Lokasi[]
}) {
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedHariLibur, setSelectedHariLibur] = useState<HariLibur | null>(null)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleEdit = (hariLibur: HariLibur) => {
        setSelectedHariLibur(hariLibur)
        setOpenEdit(true)
    }

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const hariLibur = hariLiburs[Number(index)]

            if (hariLibur) {
                router.delete(`/admin/hari-libur/${hariLibur.id}`, {
                    only: [],
                })
            }
        })
        toast(`${count} hari libur berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Hari Libur" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Hari Libur
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {hariLiburs.length} hari libur
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
                                            Hapus Hari Libur
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> hari libur
                                            yang dipilih?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
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
                        <CreateHariLiburModal lokasis={lokasis} />
                    </div>
                </div>

                <DataTable
                    columns={columns(handleEdit)}
                    data={hariLiburs}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                {selectedHariLibur && (
                    <EditHariLiburModal
                        open={openEdit}
                        setOpen={setOpenEdit}
                        hariLibur={selectedHariLibur}
                        lokasis={lokasis}
                    />
                )}
            </div>
        </>
    )
}

HariLiburPage.layout = {
    breadcrumbs: [
        {
            title: "Hari Libur",
            href: "/admin/hari-libur",
        },
    ],
}
