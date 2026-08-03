"use client"

import { Head } from "@inertiajs/react"

import type { JamBukaItem } from "./jam-buka-editor"
import { LokasiForm } from "./lokasi-form"

type Lokasi = {
    id: number
    nama: string
    slug: string
    alamat: string
    telepon: string | null
    email: string | null
    deskripsi: string | null
    latitude: number | null
    longitude: number | null
    is_utama: boolean
}

export default function EditLokasi({
    lokasi,
    jamBuka,
}: {
    lokasi: Lokasi
    jamBuka: JamBukaItem[]
}) {
    return (
        <>
            <Head title={`Edit Lokasi: ${lokasi.nama}`} />

            <LokasiForm
                initial={{
                    nama: lokasi.nama,
                    slug: lokasi.slug,
                    alamat: lokasi.alamat,
                    telepon: lokasi.telepon ?? "",
                    email: lokasi.email ?? "",
                    deskripsi: lokasi.deskripsi ?? "",
                    latitude: lokasi.latitude?.toString() ?? "",
                    longitude: lokasi.longitude?.toString() ?? "",
                    is_utama: lokasi.is_utama,
                }}
                jamBuka={jamBuka}
                method="put"
                submitHref={`/admin/lokasi/${lokasi.id}`}
                submitLabel="Perbarui Lokasi"
                pageTitle={`Edit: ${lokasi.nama}`}
                pageDesc="Ubah detail lokasi dan jam buka setiap harinya."
                backHref="/admin/lokasi"
            />
        </>
    )
}

EditLokasi.layout = {
    breadcrumbs: [
        { title: "Lokasi", href: "/admin/lokasi" },
        { title: "Edit", href: "" },
    ],
}
