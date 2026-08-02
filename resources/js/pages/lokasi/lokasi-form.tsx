"use client"

import { Link, router, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import { useEffect, useState } from "react"

import { toast } from "sonner"
import { MapPicker } from "@/components/map-picker"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { JamBukaItem } from "./jam-buka-editor"
import { JamBukaEditor } from "./jam-buka-editor"

type LokasiFormProps = {
    initial?: {
        nama?: string
        slug?: string
        alamat?: string
        telepon?: string
        email?: string
        deskripsi?: string
        latitude?: string
        longitude?: string
    }
    jamBuka: JamBukaItem[]
    method: "post" | "put"
    submitHref: string
    submitLabel: string
    pageTitle: string
    pageDesc: string
    backHref: string
}

export function LokasiForm({
    initial = {},
    jamBuka,
    method,
    submitHref,
    submitLabel,
    pageTitle,
    pageDesc,
    backHref,
}: LokasiFormProps) {
    const [dirty, setDirty] = useState(false)
    const [showUnsaved, setShowUnsaved] = useState(false)

    const { data, setData, post, put, processing, errors, transform } = useForm(
        {
            nama: initial.nama ?? "",
            slug: initial.slug ?? "",
            alamat: initial.alamat ?? "",
            telepon: initial.telepon ?? "",
            email: initial.email ?? "",
            deskripsi: initial.deskripsi ?? "",
            latitude: initial.latitude ?? "",
            longitude: initial.longitude ?? "",
            jam_buka: jamBuka,
        },
    )

    const set = <K extends keyof typeof data>(
        key: K,
        value: (typeof data)[K],
    ) => {
        setData(key, value as any)
        setDirty(true)
    }

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault()
            }
        }

        window.addEventListener("beforeunload", handler)

        return () => window.removeEventListener("beforeunload", handler)
    }, [dirty])

    useEffect(() => {
        if (initial.latitude || initial.longitude) {
            return
        }

        if (!("geolocation" in navigator)) {
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData(
                    "latitude",
                    String(Number(position.coords.latitude.toFixed(7))),
                )
                setData(
                    "longitude",
                    String(Number(position.coords.longitude.toFixed(7))),
                )
            },
            () => {},
        )
    }, [initial.latitude, initial.longitude, setData])

    const getNow = () =>
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        transform((d) => ({
            ...d,
            latitude: d.latitude === "" ? null : d.latitude,
            longitude: d.longitude === "" ? null : d.longitude,
            jam_buka: d.jam_buka.map((item) =>
                item.mode === "custom"
                    ? item
                    : { ...item, jam_buka: null, jam_tutup: null },
            ),
        }))

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setDirty(false)
                toast(`Lokasi ${data.nama} berhasil disimpan`, {
                    description: getNow(),
                })
            },
            onError: () => {
                toast("Gagal menyimpan lokasi", {
                    description: "Periksa kembali data yang diinput.",
                })
            },
        }

        if (method === "put") {
            put(submitHref, options)

            return
        }

        post(submitHref, options)
    }

    const generateSlug = (value: string) => {
        const generated = value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
        set("slug", generated)
    }

    const handleBack = (e: React.MouseEvent) => {
        if (dirty) {
            e.preventDefault()
            setShowUnsaved(true)

            return
        }
    }

    const confirmLeave = () => {
        setShowUnsaved(false)
        router.visit(backHref)
    }

    return (
        <>
            <form onSubmit={submit}>
                <div className="space-y-6 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">
                                {pageTitle}
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <p className="text-sm text-foreground">
                                    {pageDesc}
                                </p>
                            </div>
                        </div>

                        <Link href={backHref} onClick={handleBack}>
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2 hover:!bg-muted hover:!text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
                            <div className="border-b border-border/80 px-4 py-3">
                                <h3 className="text-base font-semibold">
                                    Detail Lokasi
                                </h3>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nama Lokasi</Label>
                                            <Input
                                                value={data.nama}
                                                onChange={(e) => {
                                                    set("nama", e.target.value)

                                                    if (
                                                        !data.slug ||
                                                        data.slug ===
                                                            data.nama
                                                                .toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-",
                                                                )
                                                                .replace(
                                                                    /[^a-z0-9-]/g,
                                                                    "",
                                                                )
                                                    ) {
                                                        generateSlug(
                                                            e.target.value,
                                                        )
                                                    }
                                                }}
                                                placeholder="Contoh: Perpustakaan Utama"
                                            />
                                            {errors.nama && (
                                                <p className="text-sm text-destructive">
                                                    {errors.nama}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Slug</Label>
                                            <Input
                                                value={data.slug}
                                                onChange={(e) =>
                                                    set("slug", e.target.value)
                                                }
                                                placeholder="Contoh: perpustakaan-utama"
                                            />
                                            {errors.slug && (
                                                <p className="text-sm text-destructive">
                                                    {errors.slug}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Alamat</Label>
                                            <Input
                                                value={data.alamat}
                                                onChange={(e) =>
                                                    set(
                                                        "alamat",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Jl. Raya Situbondo No. 5"
                                            />
                                            {errors.alamat && (
                                                <p className="text-sm text-destructive">
                                                    {errors.alamat}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Deskripsi</Label>
                                            <Textarea
                                                rows={4}
                                                value={data.deskripsi}
                                                onChange={(e) =>
                                                    set(
                                                        "deskripsi",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Deskripsi singkat lokasi, fasilitas, atau petunjuk arah…"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>Telepon</Label>
                                                <Input
                                                    value={data.telepon}
                                                    onChange={(e) =>
                                                        set(
                                                            "telepon",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="031-123456"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        set(
                                                            "email",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="info@…"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <MapPicker
                                            latitude={
                                                data.latitude &&
                                                Number.isFinite(
                                                    Number(data.latitude),
                                                )
                                                    ? Number(data.latitude)
                                                    : null
                                            }
                                            longitude={
                                                data.longitude &&
                                                Number.isFinite(
                                                    Number(data.longitude),
                                                )
                                                    ? Number(data.longitude)
                                                    : null
                                            }
                                            onChange={(lat, lng) => {
                                                set(
                                                    "latitude",
                                                    String(
                                                        Number(lat.toFixed(7)),
                                                    ),
                                                )
                                                set(
                                                    "longitude",
                                                    String(
                                                        Number(lng.toFixed(7)),
                                                    ),
                                                )
                                            }}
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>Latitude</Label>
                                                <Input
                                                    value={data.latitude}
                                                    onChange={(e) =>
                                                        set(
                                                            "latitude",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="-7.7800000"
                                                    inputMode="decimal"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Longitude</Label>
                                                <Input
                                                    value={data.longitude}
                                                    onChange={(e) =>
                                                        set(
                                                            "longitude",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="112.4450000"
                                                    inputMode="decimal"
                                                />
                                            </div>
                                        </div>

                                        {errors.latitude && (
                                            <p className="text-sm text-destructive">
                                                {errors.latitude}
                                            </p>
                                        )}
                                        {errors.longitude && (
                                            <p className="text-sm text-destructive">
                                                {errors.longitude}
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            Gunakan format desimal. Contoh:
                                            -7.7800000, 112.4450000
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
                            <div className="border-b border-border/80 px-4 py-3">
                                <h3 className="text-base font-semibold">
                                    Jam Buka
                                </h3>
                            </div>

                            <div className="p-4">
                                <JamBukaEditor
                                    value={data.jam_buka}
                                    onChange={(items) => {
                                        set("jam_buka", items)
                                    }}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? "Menyimpan…" : submitLabel}
                        </Button>
                    </div>
                </div>
            </form>

            <AlertDialog open={showUnsaved} onOpenChange={setShowUnsaved}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Perubahan Belum Disimpan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Ada perubahan yang belum disimpan. Yakin ingin
                            meninggalkan halaman?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmLeave}
                        >
                            Tinggalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
