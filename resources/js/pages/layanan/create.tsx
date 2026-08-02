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
import { LayananFormFields } from "./layanan-form"
import type { JenisLayananOption } from "./layanan-form"

export default function CreateLayananModal({
    jenisLayanans,
}: {
    jenisLayanans: JenisLayananOption[]
}) {
    const [open, setOpen] = useState(false)

    const { data, setData, post, processing, reset, errors } = useForm({
        nama_layanan: "",
        slug: "",
        url: "",
        deskripsi: "",
        jenis_layanan_id: "",
        jenis_baru: "",
        jenis_baru_deskripsi: "",
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

        post("/admin/layanan", {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Layanan ${data.nama_layanan} berhasil ditambahkan`, {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Tambah Layanan
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title="Tambah Layanan"
                        description="Tambahkan layanan baru."
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
                            {processing ? "Menyimpan…" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
