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
import type { Berita } from "./columns"

export default function BeritaPage({
    beritas,
}: {
    beritas: Berita[]
}) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const berita = beritas[Number(index)]

            if (berita) {
                router.delete(`/admin/berita/${berita.id}`, {
                    only: [],
                })
            }
        })
        toast(`${count} berita berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Berita" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Berita
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {beritas.length} berita
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
                                            Hapus Berita
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> berita
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
                        <Link href="/admin/berita/create">
                            <Button>
                                <Plus className="h-4 w-4" />
                                Tambah Berita
                            </Button>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={beritas}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>
        </>
    )
}

BeritaPage.layout = {
    breadcrumbs: [
        {
            title: "Berita",
            href: "/admin/berita",
        },
    ],
}
