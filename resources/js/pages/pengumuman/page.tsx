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
import type { Pengumuman } from "./columns"

export default function PengumumanPage({
    pengumumans,
}: {
    pengumumans: Pengumuman[]
}) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const pengumuman = pengumumans[Number(index)]

            if (pengumuman) {
                router.delete(`/admin/pengumuman/${pengumuman.id}`, {
                    only: [],
                })
            }
        })
        toast(`${count} pengumuman berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Pengumuman" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Pengumuman
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {pengumumans.length} pengumuman
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
                                            Hapus Pengumuman
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus{" "}
                                            <b>{selectedCount}</b> pengumuman
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
                        <Link href="/admin/pengumuman/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pengumuman
                            </Button>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={pengumumans}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>
        </>
    )
}

PengumumanPage.layout = {
    breadcrumbs: [
        {
            title: "Pengumuman",
            href: "/admin/pengumuman",
        },
    ],
}
