"use client"

import { useForm } from "@inertiajs/react"
import { Plus } from "lucide-react"
import { useState } from "react"

import { toast } from "sonner"
import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { KegiatanFormFields } from "./kegiatan-form"

type Lokasi = {
    id: number
    nama: string
}

export default function CreateKegiatanModal({
    lokasis,
}: {
    lokasis: Lokasi[]
}) {
    const [open, setOpen] = useState(false)

    const { data, setData, post, processing, reset, errors } = useForm({
        nama: "",
        tanggal: "",
        waktu_mulai: "",
        waktu_selesai: "",
        lokasi_id: "",
        tempat: "",
        deskripsi: "",
    })

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

        post("/admin/kegiatan", {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Kegiatan ${data.nama} berhasil ditambahkan`, {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Tambah Kegiatan
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title="Tambah Kegiatan"
                        description="Catat kegiatan atau acara baru."
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
                            {processing ? "Menyimpan…" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
