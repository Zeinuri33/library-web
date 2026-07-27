"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Copy, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { router } from "@inertiajs/react"
import { toast } from "sonner"

export type User = {
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
  role?: string
  roles?: { name: string }[]
  created_at?: string
  updated_at?: string
}

const handleDelete = (user: any) => {
  router.delete(`/users/${user.id}`, {
    onSuccess: () => {
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

      toast(`User ${user.name} berhasil dihapus`, {
        description: now,
      })
    },
    onError: () => {
      toast("Gagal menghapus user", {
        description: "Terjadi kesalahan.",
      })
    },
  })
}

export const columns = (onEdit: (user: User) => void): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "pengguna",
    header: "Member",
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const name = row.original.name
      const email = row.original.email

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
            <AvatarImage
              src={row.original.avatar_url || undefined}
              alt={name}
            />
            <AvatarFallback className="rounded-full bg-gradient-to-br from-primary/80 to-primary text-xs font-bold text-white">
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-foreground truncate">{name}</span>
            <span className="text-xs text-muted-foreground truncate">{email}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: "role",
    accessorFn: (row) => row.role || row.roles?.[0]?.name || "",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role || row.original.roles?.[0]?.name || "-"
      return (
        <Badge variant="outline" className="capitalize">
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          @{row.original.username}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Yakin ingin menghapus user <b>{user.name}</b>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(user)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
