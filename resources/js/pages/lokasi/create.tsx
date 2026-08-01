"use client"

import { Head } from "@inertiajs/react"

import type { JamBukaItem } from "./jam-buka-editor"
import { LokasiForm } from "./lokasi-form"

export default function CreateLokasi({
    defaultJamBuka,
}: {
    defaultJamBuka: JamBukaItem[]
}) {
    return (
        <>
            <Head title="Tambah Lokasi" />

            <LokasiForm
                jamBuka={defaultJamBuka}
                method="post"
                submitHref="/admin/lokasi"
                submitLabel="Simpan Lokasi"
                pageTitle="Tambah Lokasi"
                pageDesc="Buat lokasi baru beserta jam buka setiap harinya."
                backHref="/admin/lokasi"
            />
        </>
    )
}

CreateLokasi.layout = {
    breadcrumbs: [
        { title: "Lokasi", href: "/admin/lokasi" },
        { title: "Tambah", href: "/admin/lokasi/create" },
    ],
}
