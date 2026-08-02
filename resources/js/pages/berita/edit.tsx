"use client"

import BeritaForm from "./berita-form"
import type { Berita } from "./columns"

export default function EditBerita({ berita }: { berita: Berita }) {
    return <BeritaForm berita={berita} mode="edit" />
}

EditBerita.layout = {
    breadcrumbs: [
        { title: "Berita", href: "/admin/berita" },
        { title: "Edit", href: "" },
    ],
}
