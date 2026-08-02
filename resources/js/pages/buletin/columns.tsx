"use client"

import { router } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { FileText, MoreVertical } from "lucide-react"

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
import type { Buletin } from "./edit"

const handleDelete = (buletin: Buletin) => {
    router.delete(`/admin/buletin/${buletin.id}`, {
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

const formatTanggal = (value: string) =>
    new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })

export const columns = (
    handleEdit: (buletin: Buletin) => void,
): ColumnDef<Buletin>[] => [
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
        accessorKey: "edisi",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>Edisi</DataTableSortHeader>
        ),
        cell: ({ row }) => (
            <div className="ml-3 font-medium text-sm text-foreground">
                {row.getValue("edisi")}
            </div>
        ),
    },

    {
        accessorKey: "tanggal_terbit",
        header: ({ column }) => (
            <DataTableSortHeader column={column}>
                Tanggal Terbit
            </DataTableSortHeader>
        ),
        cell: ({ row }) => (
            <div className="ml-3 text-sm text-muted-foreground">
                {formatTanggal(row.getValue("tanggal_terbit"))}
            </div>
        ),
    },

    {
        accessorKey: "pdf_url",
        header: "File PDF",
        cell: ({ row }) => {
            const url = row.getValue("pdf_url") as string | null

            return (
                <div className="ml-3 text-sm">
                    {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                        >
                            <FileText className="h-4 w-4" />
                            Lihat PDF
                        </a>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    )}
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
                                        Hapus Buletin
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Yakin ingin menghapus{" "}
                                        <b>{row.original.edisi}</b>? File PDF
                                        terkait juga akan dihapus.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Batal
                                    </AlertDialogCancel>
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
