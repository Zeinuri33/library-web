"use client"

import { useEffect, useRef } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { useForm } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Heading from "@/components/heading"
import { toast } from "sonner"
import TiptapEditor from "@/components/tiptap-editor"

export default function EditTentang({ tentang }: { tentang: any }) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        nama: tentang.nama,
        slug: tentang.slug,
        isi: tentang.isi,
    })
    const uploadedRef = useRef<string[]>([])

    const deleteUploaded = () => {
        uploadedRef.current.forEach((url) => {
            fetch('/admin/upload-image/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
        })
        uploadedRef.current = []
    }

    const deleteUploadedBeacon = () => {
        uploadedRef.current.forEach((url) => {
            navigator.sendBeacon(
                '/admin/upload-image/delete',
                new Blob([JSON.stringify({ url })], { type: 'application/json' })
            )
        })
        uploadedRef.current = []
    }

    const handleLeave = () => {
        if (isDirty || uploadedRef.current.length > 0) {
            deleteUploaded()
        }
    }

    useEffect(() => {
        return () => handleLeave()
    }, [])

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty || uploadedRef.current.length > 0) {
                e.preventDefault()
            }
        }
        const unloadHandler = () => {
            if (uploadedRef.current.length > 0) {
                deleteUploadedBeacon()
            }
        }
        window.addEventListener('beforeunload', handler)
        window.addEventListener('unload', unloadHandler)
        return () => {
            window.removeEventListener('beforeunload', handler)
            window.removeEventListener('unload', unloadHandler)
        }
    }, [isDirty])

    const confirmLeave = () => {
        if (isDirty || uploadedRef.current.length > 0) {
            return window.confirm('Ada perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?')
        }
        return true
    }

    const handleBack = (e: React.MouseEvent) => {
        if (!confirmLeave()) {
            e.preventDefault()
            return
        }
        deleteUploaded()
    }

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        put(`/admin/tentang/${tentang.id}`, {
            onSuccess: () => {
                uploadedRef.current = []
                const now = new Date().toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }) + " pukul " + new Date().toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                toast(`Tentang ${data.nama} berhasil diperbarui`, {
                    description: now,
                })
            },
            onError: () => {
                toast("Gagal update tentang", {
                    description: "Periksa kembali data.",
                })
            },
        })
    }

    return (
        <>
            <Head title="Edit Tentang" />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Edit Tentang"
                        description={`Ubah ${tentang.nama}`}
                    />
                    <Link
                        href="/admin/tentang"
                        onClick={handleBack}
                    >
                        <Button variant="outline" type="button">
                            Kembali
                        </Button>
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-3xl">
                    <div>
                        <Label className="pb-2">Nama</Label>
                        <Input
                            placeholder="Contoh: Visi & Misi"
                            value={data.nama}
                            onChange={(e) => setData("nama", e.target.value)}
                        />
                        {errors.nama && (
                            <p className="text-destructive text-sm mt-1">{errors.nama}</p>
                        )}
                    </div>

                    <div>
                        <Label className="pb-2">Slug</Label>
                        <Input
                            placeholder="Contoh: visi-misi"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                        />
                        {errors.slug && (
                            <p className="text-destructive text-sm mt-1">{errors.slug}</p>
                        )}
                    </div>

                    <div>
                        <Label className="pb-2">Isi</Label>
                        <TiptapEditor
                            value={data.isi}
                            onChange={(html) => setData("isi", html)}
                            placeholder="Tulis konten tentang..."
                            onUpload={(url) => uploadedRef.current.push(url)}
                        />
                        {errors.isi && (
                            <p className="text-destructive text-sm mt-1">{errors.isi}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                        <Link
                            href="/admin/tentang"
                            onClick={handleBack}
                        >
                            <Button variant="outline" type="button">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

EditTentang.layout = {
    breadcrumbs: [
        { title: "Tentang", href: "/admin/tentang" },
        { title: "Edit", href: "" },
    ],
}
