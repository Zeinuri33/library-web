"use client"

import { router } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"

import { toast } from "sonner"
import { DataTableSortHeader } from "@/components/data-table-sort-header"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Kegiatan = {
    id: number
    nama: string
    tanggal: string
    lokasi_id: number | null
    waktu_mulai: string | null
    waktu_selesai: string | null
    tempat: string | null
    deskripsi: string | null
    waktu: string | null
    nama_lokasi: string | null
    created_at: string
    updated_at: string
}

const formatTanggal = (value: string) => {
    const date = new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z")

    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

const handleDelete = (kegiatan: Kegiatan) => {
    router.delete(`/admin/kegiatan/${kegiatan.id}`, {
        onSuccess: (page) => {
            const flash = (page.props as any).flash

            const now =
                new Date().toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }) +
                " pukul " +
                new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })

            if (flash?.error) {
                toast(flash.error, { description: now })

                return
            }

            if (flash?.success) {
                toast(flash.success, { description: now })
            }
        },
    })
}

export const columns = (handleEdit: (kegiatan: Kegiatan) => void): ColumnDef<Kegiatan>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "nama",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>Nama</DataTableSortHeader>
        ),
        cell: ({ row }) => (
            <div className="ml-3 font-medium text-sm text-foreground">
                {row.getValue("nama")}
            </div>
        ),
    },

    {
        accessorKey: "tanggal",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>Tanggal</DataTableSortHeader>
        ),
        sortingFn: (rowA, rowB) => {
            const a = rowA.getValue("tanggal") as string
            const b = rowB.getValue("tanggal") as string

            return a.localeCompare(b)
        },
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground">
                {formatTanggal(row.getValue("tanggal"))}
            </div>
        ),
    },

    {
        accessorKey: "waktu",
        header: "Waktu",
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground">
                {row.getValue("waktu") || "—"}
            </div>
        ),
    },

    {
        accessorKey: "nama_lokasi",
        header: "Tempat",
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground max-w-[220px] truncate">
                {row.getValue("nama_lokasi") || "—"}
            </div>
        ),
    },

    {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground max-w-[260px] truncate">
                {row.getValue("deskripsi") || "—"}
            </div>
        ),
    },

    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:!bg-muted hover:!text-foreground"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() => handleEdit(row.original)}
                            className="focus:!bg-muted focus:!text-foreground"
                        >
                            Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:!text-destructive focus:!bg-destructive/10"
                                >
                                    Hapus
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Hapus Kegiatan
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Yakin ingin menghapus{" "}
                                        <b>{row.original.nama}</b>?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            handleDelete(row.original)
                                        }
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]
