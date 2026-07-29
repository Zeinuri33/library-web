"use client"

import { useState } from "react"
import { Head, router, Link } from "@inertiajs/react"
import { columns, Tentang } from "./columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
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

export default function TentangPage({ tentangs }: { tentangs: Tentang[] }) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

    const selectedCount = Object.keys(rowSelection).length

    const handleBulkDelete = () => {
        const selectedRows = Object.keys(rowSelection)
        const count = selectedRows.length
        selectedRows.forEach((index) => {
            const tentang = tentangs[Number(index)]
            if (tentang) {
                router.delete(`/admin/tentang/${tentang.id}`, { only: [] })
            }
        })
        toast(`${count} tentang berhasil dihapus`)
        setRowSelection({})
    }

    return (
        <>
            <Head title="Tentang" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Daftar Tentang
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {tentangs.length} halaman
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
                                        <AlertDialogTitle>Hapus Tentang</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Yakin ingin menghapus <b>{selectedCount}</b> halaman yang dipilih?
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
                        <Link href="/admin/tentang/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Tentang
                            </Button>
                        </Link>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={tentangs}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                />
            </div>
        </>
    )
}

TentangPage.layout = {
    breadcrumbs: [
        {
            title: "Tentang",
            href: "/admin/tentang",
        },
    ],
}
