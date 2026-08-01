"use client"

import { Head, router, Link } from "@inertiajs/react"
import { Plus, Trash2 } from "lucide-react"
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
import type { Lokasi } from "./columns"

export default function LokasiPage({ lokasis }: { lokasis: Lokasi[] }) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const lokasi = lokasis[Number(index)]

            if (lokasi) {
                router.delete(`/admin/lokasi/${lokasi.id}`, { only: [] })
            }
        })
        toast(`${count} lokasi berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Lokasi" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Lokasi
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {lokasis.length} lokasi
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
                                            Hapus Lokasi
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> lokasi yang
                                            dipilih?
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
                        <Link href="/admin/lokasi/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Lokasi
                            </Button>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={lokasis}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>
        </>
    )
}

LokasiPage.layout = {
    breadcrumbs: [
        {
            title: "Lokasi",
            href: "/admin/lokasi",
        },
    ],
}
