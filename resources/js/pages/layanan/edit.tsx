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
import { LayananFormFields } from "./layanan-form"
import type { JenisLayananOption } from "./layanan-form"

export type Layanan = {
    id: number
    nama_layanan: string
    slug: string
    url: string | null
    deskripsi: string | null
    jenis_layanan: {
        id: number
        nama: string
    } | null
}

export default function EditLayananModal({
    open,
    setOpen,
    layanan,
    jenisLayanans,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    layanan: Layanan | null
    jenisLayanans: JenisLayananOption[]
}) {
    const { data, setData, put, processing, reset, errors } = useForm({
        nama_layanan: "",
        slug: "",
        url: "",
        deskripsi: "",
        jenis_layanan_id: "",
        jenis_baru: "",
    })

    useEffect(() => {
        if (layanan && open) {
            setData({
                nama_layanan: layanan.nama_layanan || "",
                slug: layanan.slug || "",
                url: layanan.url ?? "",
                deskripsi: layanan.deskripsi ?? "",
                jenis_layanan_id: layanan.jenis_layanan
                    ? String(layanan.jenis_layanan.id)
                    : "",
                jenis_baru: "",
            })
        }
    }, [layanan, open])

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

        if (!layanan) {
            return
        }

        put(`/admin/layanan/${layanan.id}`, {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Layanan ${data.nama_layanan} berhasil diperbarui`, {
                    description: getNow(),
                })
            },
            onError: () => {
                toast("Gagal menyimpan layanan", {
                    description: "Periksa kembali data yang diinput.",
                })
            },
        })
    }

    if (!open || !layanan) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title={`Edit: ${layanan.nama_layanan}`}
                        description="Ubah detail layanan."
                    />
                    <Separator />
                </DialogHeader>

                <form onSubmit={submit}>
                    <LayananFormFields
                        data={data}
                        setData={setData as any}
                        errors={errors}
                        jenisLayanans={jenisLayanans}
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
