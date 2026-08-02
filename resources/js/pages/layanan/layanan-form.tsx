"use client"

import { router } from "@inertiajs/react"
import { Trash2 } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type JenisLayananOption = {
    id: number
    nama: string
}

type LayananData = {
    nama_layanan: string
    slug: string
    url: string
    deskripsi: string
    jenis_layanan_id: string
    jenis_baru: string
}

type LayananFormFieldsProps = {
    data: LayananData
    setData: (key: keyof LayananData, value: any) => void
    errors: Partial<Record<keyof LayananData, string>>
    jenisLayanans: JenisLayananOption[]
}

const generateSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")

export function LayananFormFields({
    data,
    setData,
    errors,
    jenisLayanans,
}: LayananFormFieldsProps) {
    const handleNamaChange = (value: string) => {
        setData("nama_layanan", value)

        const auto = generateSlug(value)

        if (!data.slug || data.slug === generateSlug(data.nama_layanan)) {
            setData("slug", auto)
        }
    }

    const handleDeleteJenis = (id: number) => {
        router.delete(`/admin/jenis-layanan/${id}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (data.jenis_layanan_id === String(id)) {
                    setData("jenis_layanan_id", "")
                }
            },
        })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Nama Layanan</Label>
                <Input
                    value={data.nama_layanan}
                    onChange={(e) => handleNamaChange(e.target.value)}
                    placeholder="Contoh: Layanan Peminjaman Buku"
                />
                {errors.nama_layanan && (
                    <p className="text-sm text-destructive">
                        {errors.nama_layanan}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                    value={data.slug}
                    onChange={(e) => setData("slug", e.target.value)}
                    placeholder="Contoh: layanan-peminjaman-buku"
                />
                {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>URL (opsional)</Label>
                <Input
                    value={data.url}
                    onChange={(e) => setData("url", e.target.value)}
                    placeholder="contoh.com/layanan"
                />
                <p className="text-xs text-muted-foreground">
                    Tanpa perlu menulis https://
                </p>
                {errors.url && (
                    <p className="text-sm text-destructive">{errors.url}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                    rows={4}
                    value={data.deskripsi}
                    onChange={(e) => setData("deskripsi", e.target.value)}
                    placeholder="Deskripsi singkat layanan…"
                />
                {errors.deskripsi && (
                    <p className="text-sm text-destructive">
                        {errors.deskripsi}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                <Label>Jenis Layanan</Label>

                {jenisLayanans.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Belum ada jenis layanan. Ketik nama baru di bawah.
                    </p>
                )}

                {jenisLayanans.map((jenis) => (
                    <div
                        key={jenis.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/40 px-3 py-2"
                    >
                        <label className="flex flex-1 cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={
                                    data.jenis_layanan_id === String(jenis.id)
                                }
                                onCheckedChange={() =>
                                    setData(
                                        "jenis_layanan_id",
                                        data.jenis_layanan_id ===
                                            String(jenis.id)
                                            ? ""
                                            : String(jenis.id),
                                    )
                                }
                            />
                            <span className="text-sm">{jenis.nama}</span>
                        </label>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:!bg-destructive/10 hover:!text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Hapus Jenis Layanan
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Yakin ingin menghapus{" "}
                                        <b>{jenis.nama}</b>?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            handleDeleteJenis(jenis.id)
                                        }
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}

                {errors.jenis_layanan_id && (
                    <p className="text-sm text-destructive">
                        {errors.jenis_layanan_id}
                    </p>
                )}

                <div className="space-y-2">
                    <Label>Jenis Baru (opsional)</Label>
                    <Input
                        value={data.jenis_baru}
                        onChange={(e) => setData("jenis_baru", e.target.value)}
                        placeholder="Ketik nama jenis baru…"
                    />
                    {errors.jenis_baru && (
                        <p className="text-sm text-destructive">
                            {errors.jenis_baru}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
