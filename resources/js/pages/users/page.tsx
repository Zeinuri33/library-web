"use client"

import { useState, useMemo } from "react"
import { Head } from '@inertiajs/react'
import { User } from "./columns"
import CreateUserModal from "./create"
import EditUserModal from "./edit"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { router } from "@inertiajs/react"
import { toast } from "sonner"
import { Download, MoreVertical, Trash2, Search, Filter, X, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SortField = "role" | "username" | "created_at"
type SortDirection = "asc" | "desc"

export default function Users({ users }: { users: User[] }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setOpenEdit(true)
  }

  const handleDelete = (user: any) => {
    router.delete(`/users/${user.id}`, {
      onSuccess: () => {
        const now = new Date().toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) + " pukul " + new Date().toLocaleTimeString("id-ID", {
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

  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>()
    users.forEach((user) => {
      const roleName = user.roles?.[0]?.name || user.role
      if (roleName) roles.add(roleName)
    })
    return Array.from(roles).sort()
  }, [users])

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())

      const userRole = user.roles?.[0]?.name || user.role || ""
      const matchesRole =
        selectedRoles.length === 0 || selectedRoles.includes(userRole)

      return matchesSearch && matchesRole
    })

    if (sortField) {
      result.sort((a, b) => {
        let aVal = ""
        let bVal = ""

        if (sortField === "role") {
          aVal = a.roles?.[0]?.name || a.role || ""
          bVal = b.roles?.[0]?.name || b.role || ""
        } else if (sortField === "username") {
          aVal = a.username || ""
          bVal = b.username || ""
        } else if (sortField === "created_at") {
          aVal = a.created_at || ""
          bVal = b.created_at || ""
        }

        const comparison = aVal.localeCompare(bVal)
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return result
  }, [users, searchQuery, selectedRoles, sortField, sortDirection])

  const hasActiveFilters = searchQuery !== "" || selectedRoles.length > 0 || sortField !== null

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRoles([])
    setSortField(null)
    setSortDirection("asc")
    setCurrentPage(1)
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
    }
    return sortDirection === "asc"
      ? <ArrowUp className="h-3.5 w-3.5" />
      : <ArrowDown className="h-3.5 w-3.5" />
  }

  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage)

  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.includes(u.id))
  const isSomeSelected = paginatedUsers.some((u) => selectedIds.includes(u.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((u) => u.id === id)))
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...paginatedUsers.map((u) => u.id)])])
    }
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleBulkDelete = () => {
    const count = selectedIds.length
    selectedIds.forEach((id) => {
      router.delete(`/users/${id}`, { only: [] })
    })
    toast(`${count} user berhasil dihapus`)
    setSelectedIds([])
  }

  const handlePerPageChange = (value: number) => {
    setPerPage(value)
    setCurrentPage(1)
  }

  const generatePageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }
    return pages
  }

  return (
    <>
      <Head title="Pengguna" />

      <div className="p-6 space-y-6">

        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight ">
              Daftar Pengguna
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-foreground">
                {(() => {
                  const roleCounts: Record<string, number> = {}
                  users.forEach((user) => {
                    const roleName = user.roles?.[0]?.name || user.role || "Unknown"
                    roleCounts[roleName] = (roleCounts[roleName] || 0) + 1
                  })
                  return Object.entries(roleCounts)
                    .map(([role, count]) => `${role} ${count}`)
                    .join(", ")
                })()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    <Trash2 className="h-4 w-4" />
                    Hapus ({selectedIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus User</AlertDialogTitle>
                    <AlertDialogDescription>
                      Yakin ingin menghapus <b>{selectedIds.length}</b> user yang dipilih?
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
            <CreateUserModal />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {/* Summary & Controls Row */}
                <tr className="border-b border-border/80 bg-muted/20">
                  <td colSpan={6} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-semibold text-foreground">{filteredUsers.length}</span> dari <span className="font-semibold text-foreground">{users.length}</span> pengguna
                      </span>
                      <div className="flex items-center gap-3">
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="default"
                            onClick={clearFilters}
                            className="gap-2 h-9 hover:!bg-sidebar-hover hover:!text-foreground transition-colors"
                          >
                            <X className="h-4 w-4" />
                            Reset
                          </Button>
                        )}
                        {/* Filter Popover */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="default"
                              className={`gap-2 h-9 hover:!bg-sidebar-hover hover:!text-foreground transition-colors ${selectedRoles.length > 0 ? "border-primary/50 bg-primary/5" : ""}`}
                            >
                              <Filter className="h-4 w-4" />
                              Filters
                              {selectedRoles.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">
                                  {selectedRoles.length}
                                </Badge>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-3" align="end">
                            <div className="space-y-3">
                              <p className="text-sm font-medium">Filter by Role</p>
                              <div className="space-y-0.5">
                                {uniqueRoles.map((role) => {
                                  const isSelected = selectedRoles.includes(role)
                                  return (
                                    <button
                                      key={role}
                                      onClick={() => toggleRole(role)}
                                      className={`flex items-center w-full gap-2 text-sm px-2.5 py-1.5 rounded-md transition-colors ${
                                        isSelected
                                          ? "bg-sidebar-hover font-medium"
                                          : "hover:bg-sidebar-hover"
                                      }`}
                                    >
                                      <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                        isSelected
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : "border-input"
                                      }`}>
                                        {isSelected && (
                                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        )}
                                      </div>
                                      <span className="capitalize">{role}</span>
                                    </button>
                                  )
                                })}
                                {uniqueRoles.length === 0 && (
                                  <p className="text-xs text-muted-foreground px-2.5 py-1.5">Tidak ada role tersedia</p>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search name, email, username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm shadow-xs placeholder:text-muted-foreground focus:border-primary/50 focus:ring-[3px] focus:ring-primary/10 focus:outline-none transition-all"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Column Headers */}
                <tr className="border-b border-border/60 bg-primary/10">
                  <th className="h-12 w-12 px-4 border-r border-border/80">
                    <Checkbox
                      checked={isAllSelected || (isSomeSelected && "indeterminate")}
                      onCheckedChange={(value) => {
                        if (value) {
                          setSelectedIds((prev) => [...new Set([...prev, ...paginatedUsers.map((u) => u.id)])])
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((u) => u.id === id)))
                        }
                      }}
                    />
                  </th>
                  <th className="h-12 px-4 text-left text-sm font-normal capitalize tracking-wider text-foreground border-r border-border/80">
                    Member
                  </th>
                  <th
                    className="h-12 px-4 text-left text-sm font-normal capitalize tracking-wider text-foreground hidden md:table-cell border-r border-border/80 cursor-pointer select-none hover:bg-sidebar-hover transition-colors"
                    onClick={() => toggleSort("role")}
                  >
                    <div className="flex items-center gap-1.5">
                      Role
                      {getSortIcon("role")}
                    </div>
                  </th>
                  <th
                    className="h-12 px-4 text-left text-sm font-normal capitalize tracking-wider text-foreground hidden lg:table-cell border-r border-border/80 cursor-pointer select-none hover:bg-sidebar-hover transition-colors"
                    onClick={() => toggleSort("username")}
                  >
                    <div className="flex items-center gap-1.5">
                      Username
                      {getSortIcon("username")}
                    </div>
                  </th>
                  <th
                    className="h-12 px-4 text-left text-sm font-normal capitalize tracking-wider text-foreground hidden lg:table-cell border-r border-border/80 cursor-pointer select-none hover:bg-sidebar-hover transition-colors"
                    onClick={() => toggleSort("created_at")}
                  >
                    <div className="flex items-center gap-1.5">
                      Dibuat
                      {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th className="h-12 px-4 text-right text-sm font-normal capitalize tracking-wider text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border/80 last:border-0 hover:bg-muted/50 transition-colors duration-150"
                    >
                      {/* Checkbox Column */}
                      <td className="px-4 py-3 border-r border-border/80">
                        <Checkbox
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={() => toggleSelectOne(user.id)}
                        />
                      </td>
                      {/* Member Column */}
                      <td className="px-4 py-3 border-r border-border/80">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage
                              src={user.avatar_url || undefined}
                              alt={user.name}
                            />
                            <AvatarFallback className="rounded-full bg-gradient-to-br from-primary/80 to-primary text-xs font-bold text-white">
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-foreground truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {user.email || "Tidak ada email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-4 py-3 hidden md:table-cell border-r border-border/80">
                        <Badge variant="outline" className="capitalize">
                          {user.roles?.[0]?.name || user.role || "-"}
                        </Badge>
                      </td>

                      {/* Username Column */}
                      <td className="px-4 py-3 hidden lg:table-cell border-r border-border/80">
                        <span className="text-sm text-muted-foreground">
                          @{user.username}
                        </span>
                      </td>

                      {/* Created At Column */}
                      <td className="px-4 py-3 hidden lg:table-cell border-r border-border/80">
                        <span className="text-sm text-muted-foreground">
                          {user.created_at ? new Date(user.created_at).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) : "-"}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:!bg-muted hover:!text-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(user)} className="focus:!bg-muted focus:!text-foreground">
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                          <Search className="h-5 w-5 opacity-40" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Data tidak ditemukan</p>
                          <p className="text-xs text-muted-foreground/70 mt-0.5">
                            {hasActiveFilters ? "Coba ubah filter atau kata kunci pencarian" : "Tidak ada data pengguna yang tersedia"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <tfoot>
                  <tr className="border-t border-border/60 bg-muted/20">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        {/* Left: Range info + Show per page */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>
                            {filteredUsers.length > 0
                              ? `${(currentPage - 1) * perPage + 1}-${Math.min(currentPage * perPage, filteredUsers.length)} of ${filteredUsers.length}`
                              : "0 of 0"}
                          </span>
                          <div className="h-4 w-px bg-border" />
                          <span>Show</span>
                          <Select
                            value={String(perPage)}
                            onValueChange={(value) => handlePerPageChange(Number(value))}
                          >
                            <SelectTrigger size="sm" className="h-8 w-auto px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5" className="focus:bg-muted focus:text-foreground">5</SelectItem>
                              <SelectItem value="10" className="focus:bg-muted focus:text-foreground">10</SelectItem>
                              <SelectItem value="25" className="focus:bg-muted focus:text-foreground">25</SelectItem>
                              <SelectItem value="50" className="focus:bg-muted focus:text-foreground">50</SelectItem>
                              <SelectItem value={String(filteredUsers.length)} className="focus:bg-muted focus:text-foreground">All</SelectItem>
                            </SelectContent>
                          </Select>
                          <span>per page</span>
                        </div>

                        {/* Right: Page numbers */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0 hover:!bg-muted hover:!text-foreground"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {generatePageNumbers().map((page, index) =>
                            page === "..." ? (
                              <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">
                                ...
                              </span>
                            ) : (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 p-0 ${currentPage === page ? "" : "hover:!bg-muted hover:!text-foreground"}`}
                              >
                                {page}
                              </Button>
                            )
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0 hover:!bg-muted hover:!text-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Modal Edit */}
        {selectedUser && (
          <EditUserModal
            open={openEdit}
            setOpen={setOpenEdit}
            user={selectedUser}
          />
        )}
      </div>
    </>
  )
}

Users.layout = {
  breadcrumbs: [
    {
      title: 'Pengguna',
      href: '/users',
    },
  ],
}
