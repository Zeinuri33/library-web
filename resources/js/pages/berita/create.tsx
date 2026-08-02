"use client"

import BeritaForm from "./berita-form"

export default function CreateBerita() {
    return <BeritaForm mode="create" />
}

CreateBerita.layout = {
    breadcrumbs: [
        { title: "Berita", href: "/admin/berita" },
        { title: "Tambah", href: "/admin/berita/create" },
    ],
}
