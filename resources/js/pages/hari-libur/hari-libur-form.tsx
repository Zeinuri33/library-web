"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type Shif = "pagi" | "siang" | "malam"

export const SHIF_OPTIONS: { value: Shif; label: string }[] = [
    { value: "pagi", label: "Pagi" },
    { value: "siang", label: "Siang" },
    { value: "malam", label: "Malam" },
]

export const MODE_OPTIONS = [
    { value: "full", label: "Full Day (sehari penuh)", desc: "Semua shift tutup" },
    { value: "shift", label: "Per Shift", desc: "Pilih shift yang tutup" },
]

export const LOKASI_MODE_OPTIONS = [
    { value: "all", label: "Semua Lokasi", desc: "Berlaku untuk semua lokasi" },
    { value: "select", label: "Pilih Lokasi Tertentu", desc: "Pilih satu atau lebih lokasi" },
]

type Lokasi = {
    id: number
    nama: string
}

type HariLiburData = {
    nama: string
    tanggal: string
    lokasi_mode: "all" | "select"
    lokasi_ids: string[]
    mode: "full" | "shift"
    shif: Shif[]
    keterangan: string
}

type HariLiburFormFieldsProps = {
    data: HariLiburData
    setData: (key: keyof HariLiburData, value: any) => void
    errors: Partial<Record<keyof HariLiburData, string>>
    lokasis: Lokasi[]
}

export function HariLiburFormFields({
    data,
    setData,
    errors,
    lokasis,
}: HariLiburFormFieldsProps) {
    const toggleShif = (shif: Shif, checked: boolean) => {
        setData(
            "shif",
            checked ? [...data.shif, shif] : data.shif.filter((s) => s !== shif)
        )
    }

    const toggleLokasi = (id: number, checked: boolean) => {
        const value = String(id)

        setData(
            "lokasi_ids",
            checked
                ? [...data.lokasi_ids, value]
                : data.lokasi_ids.filter((s) => s !== value)
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Nama Hari Libur</Label>
                <Input
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    placeholder="Contoh: Hari Raya Idul Fitri"
                />
                {errors.nama && (
                    <p className="text-sm text-destructive">{errors.nama}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input
                        type="date"
                        value={data.tanggal}
                        onChange={(e) => setData("tanggal", e.target.value)}
                    />
                    {errors.tanggal && (
                        <p className="text-sm text-destructive">
                            {errors.tanggal}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Lokasi</Label>
                    <Select
                        value={data.lokasi_mode}
                        onValueChange={(v) => {
                            const mode = v as "all" | "select"
                            setData("lokasi_mode", mode)

                            if (mode === "all") {
                                setData("lokasi_ids", [])
                            }
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LOKASI_MODE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium">
                            {
                                LOKASI_MODE_OPTIONS.find(
                                    (o) => o.value === data.lokasi_mode
                                )?.label
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {
                                LOKASI_MODE_OPTIONS.find(
                                    (o) => o.value === data.lokasi_mode
                                )?.desc
                            }
                        </p>
                    </div>
                    <Badge
                        variant={
                            data.lokasi_mode === "select"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {data.lokasi_mode === "select"
                            ? `${data.lokasi_ids.length} Lokasi`
                            : "Semua"}
                    </Badge>
                </div>

                {data.lokasi_mode === "select" && (
                    lokasis.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Belum ada lokasi
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {lokasis.map((lokasi) => {
                                const active = data.lokasi_ids.includes(
                                    String(lokasi.id)
                                )

                                return (
                                    <label
                                        key={lokasi.id}
                                        className={`
                                            flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-colors
                                            ${
                                                active
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "bg-background hover:bg-muted"
                                            }
                                        `}
                                    >
                                        <Checkbox
                                            checked={active}
                                            onCheckedChange={(v) =>
                                                toggleLokasi(
                                                    lokasi.id,
                                                    !!v
                                                )
                                            }
                                        />
                                        {lokasi.nama}
                                    </label>
                                )
                            })}
                        </div>
                    )
                )}

                {errors.lokasi_ids && (
                    <p className="text-sm text-destructive">
                        {errors.lokasi_ids}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Mode</Label>
                <Select
                    value={data.mode}
                    onValueChange={(v) =>
                        setData("mode", v as "full" | "shift")
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {MODE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium">
                            {
                                MODE_OPTIONS.find(
                                    (o) => o.value === data.mode
                                )?.label
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {
                                MODE_OPTIONS.find(
                                    (o) => o.value === data.mode
                                )?.desc
                            }
                        </p>
                    </div>
                    <Badge
                        variant={data.mode === "shift" ? "default" : "secondary"}
                    >
                        {data.mode === "shift" ? "Per Shift" : "Full Day"}
                    </Badge>
                </div>

                {data.mode === "shift" && (
                    <div className="grid grid-cols-3 gap-2">
                        {SHIF_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className={`
                                    flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium cursor-pointer transition-colors
                                    ${
                                        data.shif.includes(opt.value)
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "bg-background hover:bg-muted"
                                    }
                                `}
                            >
                                <Checkbox
                                    checked={data.shif.includes(opt.value)}
                                    onCheckedChange={(v) =>
                                        toggleShif(opt.value, !!v)
                                    }
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                )}

                {errors.shif && (
                    <p className="text-sm text-destructive">{errors.shif}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Keterangan</Label>
                <Input
                    value={data.keterangan}
                    onChange={(e) => setData("keterangan", e.target.value)}
                    placeholder="Contoh: Cuti bersama nasional"
                />
            </div>
        </div>
    )
}
