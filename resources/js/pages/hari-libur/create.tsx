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
import { HariLiburFormFields  } from "./hari-libur-form"
import type {Shif} from "./hari-libur-form";

type Lokasi = {
    id: number
    nama: string
}

export default function CreateHariLiburModal({
    lokasis,
}: {
    lokasis: Lokasi[]
}) {
    const [open, setOpen] = useState(false)

    const { data, setData, post, processing, reset, errors } = useForm({
        nama: "",
        tanggal: "",
        lokasi_mode: "all" as "all" | "select",
        lokasi_ids: [] as string[],
        mode: "full" as "full" | "shift",
        shif: [] as Shif[],
        keterangan: "",
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

        post("/admin/hari-libur", {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Hari libur ${data.nama} berhasil ditambahkan`, {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Tambah Hari Libur
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title="Tambah Hari Libur"
                        description="Catat hari libur, baik sehari penuh maupun per shift."
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
                            {processing ? "Menyimpan…" : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
