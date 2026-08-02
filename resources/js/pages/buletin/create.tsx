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
import { BuletinFormFields } from "./buletin-form"

export default function CreateBuletinModal() {
    const [open, setOpen] = useState(false)

    const { data, setData, post, processing, reset, errors } = useForm({
        edisi: "",
        tanggal_terbit: "",
        file_pdf: null as File | null,
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

        post("/admin/buletin", {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Buletin ${data.edisi} berhasil ditambahkan`, {
                    description: getNow(),
                })
            },
            onError: () => {
                toast("Gagal menyimpan buletin", {
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
                    Tambah Buletin
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title="Tambah Buletin"
                        description="Tambahkan buletin baru."
                    />
                    <Separator />
                </DialogHeader>

                <form onSubmit={submit}>
                    <BuletinFormFields
                        data={data}
                        setData={setData as any}
                        errors={errors}
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
