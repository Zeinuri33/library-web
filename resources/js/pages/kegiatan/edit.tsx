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
import { KegiatanFormFields } from "./kegiatan-form"

type Lokasi = {
    id: number
    nama: string
}

type Kegiatan = {
    id: number
    nama: string
    tanggal: string
    lokasi_id: number | null
    waktu_mulai: string | null
    waktu_selesai: string | null
    tempat: string | null
    deskripsi: string | null
}

const toDateInput = (value: string) =>
    (value.includes("T") ? value : value.replace(" ", "T")).slice(0, 10)

const toTimeInput = (value: string | null) =>
    value ? value.slice(0, 5) : ""

export default function EditKegiatanModal({
    open,
    setOpen,
    kegiatan,
    lokasis,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    kegiatan: Kegiatan | null
    lokasis: Lokasi[]
}) {
    const { data, setData, put, processing, reset, errors } = useForm({
        nama: "",
        tanggal: "",
        waktu_mulai: "",
        waktu_selesai: "",
        lokasi_id: "",
        tempat: "",
        deskripsi: "",
    })

    useEffect(() => {
        if (kegiatan && open) {
            setData({
                nama: kegiatan.nama || "",
                tanggal: toDateInput(kegiatan.tanggal),
                waktu_mulai: toTimeInput(kegiatan.waktu_mulai),
                waktu_selesai: toTimeInput(kegiatan.waktu_selesai),
                lokasi_id: kegiatan.lokasi_id
                    ? String(kegiatan.lokasi_id)
                    : kegiatan.tempat
                      ? "__manual__"
                      : "",
                tempat: kegiatan.tempat ?? "",
                deskripsi: kegiatan.deskripsi ?? "",
            })
        }
    }, [kegiatan, open])

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

        if (!kegiatan) {
            return
        }

        put(`/admin/kegiatan/${kegiatan.id}`, {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Kegiatan ${data.nama} berhasil diperbarui`, {
                    description: getNow(),
                })
            },
            onError: () => {
                toast("Gagal menyimpan kegiatan", {
                    description: "Periksa kembali data yang diinput.",
                })
            },
        })
    }

    if (!open || !kegiatan) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title={`Edit: ${kegiatan.nama}`}
                        description="Ubah detail kegiatan atau acara."
                    />
                    <Separator />
                </DialogHeader>

                <form onSubmit={submit}>
                    <KegiatanFormFields
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
