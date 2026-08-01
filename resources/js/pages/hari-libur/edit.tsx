"use client"

import { useForm } from "@inertiajs/react"
import { useEffect } from "react"

import { toast } from "sonner"
import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { HariLiburFormFields  } from "./hari-libur-form"
import type {Shif} from "./hari-libur-form";

type Lokasi = {
    id: number
    nama: string
}

type HariLibur = {
    id: number
    nama: string
    tanggal: string
    lokasi_ids: number[] | null
    mode: "full" | "shift"
    shif: string[] | null
    keterangan: string | null
}

const toDateInput = (value: string) =>
    (value.includes("T") ? value : value.replace(" ", "T")).slice(0, 10)

export default function EditHariLiburModal({
    open,
    setOpen,
    hariLibur,
    lokasis,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    hariLibur: HariLibur | null
    lokasis: Lokasi[]
}) {
    const { data, setData, put, processing, reset, errors } = useForm({
        nama: "",
        tanggal: "",
        lokasi_mode: "all" as "all" | "select",
        lokasi_ids: [] as string[],
        mode: "full" as "full" | "shift",
        shif: [] as Shif[],
        keterangan: "",
    })

    useEffect(() => {
        if (hariLibur && open) {
            const lokasiIds = hariLibur.lokasi_ids ?? []

            setData({
                nama: hariLibur.nama || "",
                tanggal: toDateInput(hariLibur.tanggal),
                lokasi_mode: lokasiIds.length > 0 ? "select" : "all",
                lokasi_ids: lokasiIds.map(String),
                mode: hariLibur.mode,
                shif: (hariLibur.shif ?? []) as Shif[],
                keterangan: hariLibur.keterangan ?? "",
            })
        }
    }, [hariLibur, open])

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

        if (!hariLibur) {
            return
        }

        put(`/admin/hari-libur/${hariLibur.id}`, {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Hari libur ${data.nama} berhasil diperbarui`, {
                    description: getNow(),
                })
            },
            onError: () => {
                toast("Gagal menyimpan hari libur", {
                    description: "Periksa kembali data yang diinput.",
                })
            },
        })
    }

    if (!open || !hariLibur) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title={`Edit: ${hariLibur.nama}`}
                        description="Ubah detail hari libur."
                    />
                    <Separator />
                </DialogHeader>

                <form onSubmit={submit}>
                    <HariLiburFormFields
                        data={data}
                        setData={setData as any}
                        errors={errors}
                        lokasis={lokasis}
                    />

                    <div className="pt-5">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? "Menyimpan…" : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
