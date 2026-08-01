"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Lokasi = {
    id: number
    nama: string
}

type KegiatanData = {
    nama: string
    tanggal: string
    waktu_mulai: string
    waktu_selesai: string
    lokasi_id: string
    tempat: string
    deskripsi: string
}

type KegiatanFormFieldsProps = {
    data: KegiatanData
    setData: (key: keyof KegiatanData, value: any) => void
    errors: Partial<Record<keyof KegiatanData, string>>
    lokasis: Lokasi[]
}

const MANUAL_VALUE = "__manual__"

export function KegiatanFormFields({
    data,
    setData,
    errors,
    lokasis,
}: KegiatanFormFieldsProps) {
    const isManual = data.lokasi_id === MANUAL_VALUE

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Nama Kegiatan</Label>
                <Input
                    value={data.nama}
                    onChange={(e) => setData("nama", e.target.value)}
                    placeholder="Contoh: Bedah Buku & Diskusi"
                />
                {errors.nama && (
                    <p className="text-sm text-destructive">{errors.nama}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <Label>Mulai</Label>
                    <Input
                        type="time"
                        value={data.waktu_mulai}
                        onChange={(e) =>
                            setData("waktu_mulai", e.target.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <Label>Selesai</Label>
                    <Input
                        type="time"
                        value={data.waktu_selesai}
                        onChange={(e) =>
                            setData("waktu_selesai", e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Tempat</Label>
                <Select
                    value={isManual ? MANUAL_VALUE : data.lokasi_id}
                    onValueChange={(v) => {
                        setData("lokasi_id", v)

                        if (v !== MANUAL_VALUE) {
                            setData("tempat", "")
                        }
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih lokasi…" />
                    </SelectTrigger>
                    <SelectContent>
                        {lokasis.length === 0 && (
                            <p className="px-2 py-1.5 text-sm text-muted-foreground">
                                Belum ada lokasi
                            </p>
                        )}
                        {lokasis.map((lokasi) => (
                            <SelectItem
                                key={lokasi.id}
                                value={String(lokasi.id)}
                            >
                                {lokasi.nama}
                            </SelectItem>
                        ))}
                        <SelectSeparator />
                        <SelectItem value={MANUAL_VALUE}>
                            Ketik sendiri…
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.lokasi_id && (
                    <p className="text-sm text-destructive">
                        {errors.lokasi_id}
                    </p>
                )}
            </div>

            {isManual && (
                <div className="space-y-2">
                    <Label>Nama Tempat</Label>
                    <Input
                        value={data.tempat}
                        onChange={(e) => setData("tempat", e.target.value)}
                        placeholder="Contoh: Aula Perpustakaan"
                    />
                    {errors.tempat && (
                        <p className="text-sm text-destructive">
                            {errors.tempat}
                        </p>
                    )}
                </div>
            )}

            <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                    rows={4}
                    value={data.deskripsi}
                    onChange={(e) => setData("deskripsi", e.target.value)}
                    placeholder="Deskripsi singkat kegiatan…"
                />
            </div>
        </div>
    )
}
