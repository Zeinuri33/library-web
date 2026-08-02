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
import { BuletinFormFields } from "./buletin-form"

export type Buletin = {
    id: number
    edisi: string
    tanggal_terbit: string
    file_pdf: string | null
    pdf_url: string | null
}

export default function EditBuletinModal({
    open,
    setOpen,
    buletin,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    buletin: Buletin | null
}) {
    const { data, setData, put, processing, reset, errors } = useForm({
        edisi: "",
        tanggal_terbit: "",
        file_pdf: null as File | null,
    })

    useEffect(() => {
        if (buletin && open) {
            setData({
                edisi: buletin.edisi || "",
                tanggal_terbit: buletin.tanggal_terbit || "",
                file_pdf: null,
            })
        }
    }, [buletin, open])

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

        if (!buletin) {
            return
        }

        put(`/admin/buletin/${buletin.id}`, {
            onSuccess: () => {
                reset()
                setOpen(false)

                toast(`Buletin ${data.edisi} berhasil diperbarui`, {
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

    if (!open || !buletin) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <Heading
                        variant="small"
                        title={`Edit: ${buletin.edisi}`}
                        description="Ubah detail buletin."
                    />
                    <Separator />
                </DialogHeader>

                <form onSubmit={submit}>
                    <BuletinFormFields
                        data={data}
                        setData={setData as any}
                        errors={errors}
                        existingPdfUrl={buletin.pdf_url}
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
