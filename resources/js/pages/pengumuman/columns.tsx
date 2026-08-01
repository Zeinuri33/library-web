"use client"

import { Link, router } from "@inertiajs/react"
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

export type Pengumuman = {
    id: number
    judul: string
    isi: string
    deskripsi: string
    created_at: string
    updated_at: string
}

const handleDelete = (pengumuman: Pengumuman) => {
    router.delete(`/admin/pengumuman/${pengumuman.id}`, {
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

export const columns: ColumnDef<Pengumuman>[] = [
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
        accessorKey: "judul",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>Judul</DataTableSortHeader>
        ),
        cell: ({ row }) => (
            <div className="ml-3 font-medium text-sm text-foreground">
                {row.getValue("judul")}
            </div>
        ),
    },

    {
        accessorKey: "deskripsi",
        header: "Ringkasan",
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground max-w-[320px] truncate">
                {row.getValue("deskripsi")}
            </div>
        ),
    },

    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>Dibuat</DataTableSortHeader>
        ),
        sortingFn: (rowA, rowB) => {
            const a = new Date(rowA.getValue("created_at")).getTime()
            const b = new Date(rowB.getValue("created_at")).getTime()

            return a - b
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))

            return (
                <div className="ml-3 text-sm text-muted-foreground hidden md:block">
                    {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            )
        },
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
                        <Link href={`/admin/pengumuman/${row.original.id}/edit`}>
                            <DropdownMenuItem className="focus:!bg-muted focus:!text-foreground">
                                Edit
                            </DropdownMenuItem>
                        </Link>

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
                                        Hapus Pengumuman
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Yakin ingin menghapus{" "}
                                        <b>{row.original.judul}</b>?
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
