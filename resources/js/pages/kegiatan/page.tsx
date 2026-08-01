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
import type { Kegiatan } from "./columns"
import CreateKegiatanModal from "./create"
import EditKegiatanModal from "./edit"

type Lokasi = {
    id: number
    nama: string
}

export default function KegiatanPage({
    kegiatans,
    lokasis,
}: {
    kegiatans: Kegiatan[]
    lokasis: Lokasi[]
}) {
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null)
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleEdit = (kegiatan: Kegiatan) => {
        setSelectedKegiatan(kegiatan)
        setOpenEdit(true)
    }

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const kegiatan = kegiatans[Number(index)]

            if (kegiatan) {
                router.delete(`/admin/kegiatan/${kegiatan.id}`, { only: [] })
            }
        })
        toast(`${count} kegiatan berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Kegiatan" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Kegiatan
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {kegiatans.length} kegiatan
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
                                            Hapus Kegiatan
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> kegiatan
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
                        <CreateKegiatanModal lokasis={lokasis} />
                    </div>
                </div>

                <DataTable
                    columns={columns(handleEdit)}
                    data={kegiatans}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />

                {selectedKegiatan && (
                    <EditKegiatanModal
                        open={openEdit}
                        setOpen={setOpenEdit}
                        kegiatan={selectedKegiatan}
                        lokasis={lokasis}
                    />
                )}
            </div>
        </>
    )
}

KegiatanPage.layout = {
    breadcrumbs: [
        {
            title: "Kegiatan",
            href: "/admin/kegiatan",
        },
    ],
}
