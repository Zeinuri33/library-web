"use client"

import { Head, router, Link } from "@inertiajs/react"

import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import {
    ImagePlus,
    Loader2,
    Save,
} from "lucide-react"

import { useEffect, useState, useRef } from "react"

import { toast } from "sonner"
import ImageModal from "@/components/editor/image-modal"
import LinkModal from "@/components/editor/link-modal"
import { RichTextToolbar } from "@/components/editor/rich-text-toolbar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { CustomImage } from "@/extensions/custom-image"

type BeritaFormProps = {
    berita?: {
        id: number
        judul: string
        slug: string
        thumbnail: string | null
        isi: string
        tanggal?: string
    }
    mode: "create" | "edit"
}

export default function BeritaForm({ berita, mode }: BeritaFormProps) {
    const isEdit = mode === "edit"
    const STORAGE_KEY = isEdit
        ? `edit-berita-draft-${berita?.id}`
        : "create-berita-draft"
    const listUrl = "/admin/berita"
    const submitUrl = isEdit ? `/admin/berita/${berita?.id}` : "/admin/berita"
    const submitLabel = isEdit ? "Simpan Perubahan" : "Simpan Berita"
    const headerTitle = isEdit ? "Edit Berita" : "Tambah Berita"
    const headerDesc = isEdit
        ? "Ubah berita menggunakan editor modern."
        : "Buat berita menggunakan editor modern."
    const placeholder = "Tulis isi berita di sini..."

    const todayStr = () => {
        const now = new Date()
        const y = now.getFullYear()
        const m = String(now.getMonth() + 1).padStart(2, "0")
        const d = String(now.getDate()).padStart(2, "0")

        return `${y}-${m}-${d}`
    }

    const toDateInput = (value?: string | null) => {
        const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/)

        return match ? match[0] : ""
    }

    const [judul, setJudul] = useState(berita?.judul || "")
    const [slug, setSlug] = useState(berita?.slug || "")
    const [thumbnail, setThumbnail] = useState(berita?.thumbnail || "")
    const [tanggal, setTanggal] = useState(toDateInput(berita?.tanggal) || todayStr())

    const [uploadingThumb, setUploadingThumb] = useState(false)
    const [thumbDragOver, setThumbDragOver] = useState(false)
    const thumbFileRef = useRef<HTMLInputElement>(null)

    const [showImageModal, setShowImageModal] = useState(false)

    const [showImageSetting, setShowImageSetting] = useState(false)

    const [imageForm, setImageForm] = useState({
        src: "",
        alt: "",
        title: "",
        align: "center",
        size: "large",
    })

    const [showLinkModal, setShowLinkModal] = useState(false)

    const [linkForm, setLinkForm] = useState({
        url: "",
        text: "",
    })

    const [isDirty, setIsDirty] = useState(false)
    const isDirtyRef = useRef(isDirty)
    const uploadedRef = useRef<string[]>([])
    const savingRef = useRef(false)
    const [, forceUpdate] = useState(0)

    const deleteUploaded = () => {
        uploadedRef.current.forEach((url) => {
            fetch('/admin/upload-image/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
        })
        uploadedRef.current = []
    }

    const deleteUploadedBeacon = () => {
        uploadedRef.current.forEach((url) => {
            navigator.sendBeacon(
                '/admin/upload-image/delete',
                new Blob([JSON.stringify({ url })], { type: 'application/json' })
            )
        })
        uploadedRef.current = []
    }

    useEffect(() => {
        isDirtyRef.current = isDirty
    }, [isDirty])

    useEffect(() => {
        return () => {
            if (!savingRef.current && (isDirtyRef.current || uploadedRef.current.length > 0)) {
                deleteUploaded()
            }
        }
    }, [])

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty || uploadedRef.current.length > 0) {
                e.preventDefault()
            }
        }
        const unloadHandler = () => {
            if (!savingRef.current && uploadedRef.current.length > 0) {
                deleteUploadedBeacon()
            }
        }
        window.addEventListener('beforeunload', handler)
        window.addEventListener('unload', unloadHandler)

        return () => {
            window.removeEventListener('beforeunload', handler)
            window.removeEventListener('unload', unloadHandler)
        }
    }, [isDirty])

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) {
return
}

        try {
            const parsed = JSON.parse(saved)
            setJudul(parsed.judul || "")
            setSlug(parsed.slug || "")
            setThumbnail(parsed.thumbnail || "")
            setTanggal(toDateInput(parsed.tanggal) || todayStr())
        } catch (error) {
            console.error(error)
        }
    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }),
            Underline,
            Highlight,
            TextStyle,
            Color,
            CustomImage,
            LinkExtension.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],

        editorProps: {
            attributes: {
                class: "min-h-[650px] outline-none",
            },

            handleClick(view, pos) {
                const node = view.state.doc.nodeAt(pos)

                if (node?.type.name === "image") {
                    setImageForm({
                        src: node.attrs.src,
                        alt: node.attrs.alt || "",
                        title: node.attrs.title || "",
                        align: node.attrs.align || "center",
                        size: node.attrs.size || "large",
                    })

                    setShowImageSetting(true)

                    return true
                }

                return false
            },

        },

        onSelectionUpdate: () => {
            forceUpdate((n) => n + 1)
        },

        content: berita?.isi || "",
        onUpdate: ({ editor }) => {
            setIsDirty(true)
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    judul,
                    slug,
                    thumbnail,
                    tanggal,
                    isi: editor.getHTML(),
                })
            )
        },
    })

    useEffect(() => {
        if (!editor) {
return
}

        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) {
return
}

        try {
            const parsed = JSON.parse(saved)

            if (parsed.isi) {
                editor.commands.setContent(parsed.isi)
            }
        } catch (error) {
            console.error(error)
        }
    }, [editor])

    useEffect(() => {
        if (!editor) {
return
}

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                judul,
                slug,
                thumbnail,
                tanggal,
                isi: editor.getHTML(),
            })
        )
    }, [judul, editor])

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

    const generateSlug = (value: string) => {
        const generated = value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
        setSlug(generated)
    }

    const uploadThumbFile = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "berita")

        try {
            setUploadingThumb(true)

            const response = await fetch("/admin/upload-image", {
                method: "POST",
                body: formData,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            })

            if (!response.ok) {
                toast("Upload thumbnail gagal")

                return
            }

            const data = await response.json()

            if (data.url) {
                uploadedRef.current.push(data.url)
                setThumbnail(data.url)
                setIsDirty(true)
            }
        } catch (error) {
            console.error(error)
            toast("Upload thumbnail gagal")
        } finally {
            setUploadingThumb(false)
        }
    }

    const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
return
}

        await uploadThumbFile(file)
    }

    const handleThumbDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setThumbDragOver(false)

        const file = e.dataTransfer.files?.[0]

        if (file) {
            uploadThumbFile(file)
        }
    }

    const handleSubmit = () => {
        if (!editor) {
return
}

        if (!judul.trim()) {
            toast("Judul wajib diisi")

            return
        }

        if (!slug.trim()) {
            toast("Slug wajib diisi")

            return
        }

        const html = editor.getHTML()

        if (html === "<p></p>") {
            toast("Konten wajib diisi")

            return
        }

        savingRef.current = true

        const options = {
            preserveScroll: true,

            onSuccess: () => {
                savingRef.current = false
                localStorage.removeItem(STORAGE_KEY)
                uploadedRef.current = []

                toast(
                    `Berita ${judul} berhasil ${isEdit ? "diperbarui" : "dibuat"}`,
                    { description: getNow() }
                )
            },

            onError: () => {
                savingRef.current = false
                toast(
                    "Gagal menyimpan berita",
                    { description: "Periksa kembali data." }
                )
            },
        } as const

        const payload = { judul, slug, thumbnail, isi: html, tanggal }

        if (isEdit) {
            router.put(submitUrl, payload, options)
        } else {
            router.post(submitUrl, payload, options)
        }
    }

    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)

    const handleBack = (e: React.MouseEvent) => {
        if (isDirty || uploadedRef.current.length > 0) {
            e.preventDefault()
            setShowUnsavedDialog(true)

            return
        }

        deleteUploaded()
    }

    const confirmLeave = () => {
        setShowUnsavedDialog(false)
        localStorage.removeItem(STORAGE_KEY)
        deleteUploaded()
        router.visit(listUrl)
    }

    const cancelLeave = () => {
        setShowUnsavedDialog(false)
    }

    return (
        <>
            <Head title={isEdit ? `Edit Berita: ${berita?.judul}` : "Tambah Berita"} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            {headerTitle}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                {headerDesc}
                            </p>
                        </div>
                    </div>

                    <Link href={listUrl} onClick={handleBack}>
                        <Button variant="outline" className="hover:bg-muted hover:text-foreground">
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    <div className="space-y-4 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
                            <div className="border-b border-border/80">
                                <div className="px-4 pt-4 pb-5 min-h-[44px] flex items-center">
                                    <h3 className="font-semibold text-base">
                                        Informasi Berita
                                    </h3>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <Label className="pb-2">Judul</Label>
                                    <Input
                                        value={judul}
                                        onChange={(e) => {
                                            setJudul(e.target.value)

                                            if (
                                                !slug ||
                                                slug === judul.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                                            ) {
                                                generateSlug(e.target.value)
                                            }
                                        }}
                                        placeholder="Contoh: Kunjungan Studi Banding"
                                    />
                                </div>

                                <div>
                                    <Label className="pb-2">Slug</Label>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="Contoh: kunjungan-studi-banding"
                                    />
                                </div>

                                <div>
                                    <Label className="pb-2">Tanggal</Label>
                                    <Input
                                        type="date"
                                        value={tanggal}
                                        onChange={(e) => setTanggal(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label className="pb-2">Thumbnail</Label>

                                    <input
                                        ref={thumbFileRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUploadThumbnail}
                                    />

                                    {thumbnail ? (
                                        <div className="space-y-2">
                                            <div
                                                onDragOver={(e) => {
                                                    e.preventDefault()
                                                    setThumbDragOver(true)
                                                }}
                                                onDragLeave={() =>
                                                    setThumbDragOver(false)
                                                }
                                                onDrop={handleThumbDrop}
                                                className={`relative overflow-hidden rounded-lg border border-border/80 transition ${
                                                    thumbDragOver
                                                        ? "border-primary ring-2 ring-primary/40"
                                                        : ""
                                                }`}
                                            >
                                                <img
                                                    src={thumbnail}
                                                    alt="Thumbnail"
                                                    className="w-full h-36 object-cover"
                                                />

                                                {thumbDragOver && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-sm font-medium text-primary">
                                                        Lepaskan untuk mengganti
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 hover:bg-muted hover:text-foreground"
                                                    onClick={() =>
                                                        thumbFileRef.current?.click()
                                                    }
                                                    disabled={uploadingThumb}
                                                >
                                                    Ganti
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => setThumbnail("")}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() =>
                                                thumbFileRef.current?.click()
                                            }
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                setThumbDragOver(true)
                                            }}
                                            onDragLeave={() =>
                                                setThumbDragOver(false)
                                            }
                                            onDrop={handleThumbDrop}
                                            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-sm transition ${
                                                thumbDragOver
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                            }`}
                                        >
                                            {uploadingThumb ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <ImagePlus className="h-5 w-5" />
                                            )}
                                            {uploadingThumb
                                                ? "Mengunggah..."
                                                : thumbDragOver
                                                  ? "Lepaskan di sini..."
                                                  : "Seret & letakkan thumbnail di sini"}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    className="w-full gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {submitLabel}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
                            <div className="border-b border-border/80">
                                    <div className="p-3">
                                        <div className="rounded-md border border-border/80 bg-muted/40 px-2 py-1">
                                            <RichTextToolbar
                                                editor={editor}
                                                onImageClick={() =>
                                                    setShowImageModal(true)
                                                }
                                                onLinkClick={() => {
                                                const previousUrl =
                                                    editor
                                                        ?.getAttributes("link")
                                                        ?.href || ""

                                                const selectedText =
                                                    editor
                                                        ?.state.doc.textBetween(
                                                            editor.state.selection.from,
                                                            editor.state.selection.to,
                                                            " "
                                                        ) || ""

                                                setLinkForm({
                                                    url: previousUrl,
                                                    text: selectedText,
                                                })

                                                setShowLinkModal(true)
                                            }}
                                        />
                                        </div>
                                    </div>
                                </div>
                            <div
                                className="
                                    h-[500px] overflow-y-auto
                                    p-3
                                "
                            >
                                <EditorContent
                                    editor={editor}
                                    className="
                                        tiptap
                                        prose
                                        dark:prose-invert
                                        max-w-none

                                        [&_.ProseMirror]:outline-none
                                        [&_.ProseMirror]:border
                                        [&_.ProseMirror]:border-border/80
                                        [&_.ProseMirror]:rounded-lg
                                        [&_.ProseMirror]:p-4

                                        [&_.ProseMirror_h1]:text-4xl
                                        [&_.ProseMirror_h1]:font-black

                                        [&_.ProseMirror_h2]:text-3xl
                                        [&_.ProseMirror_h2]:font-bold

                                        [&_.ProseMirror_p]:leading-8

                                        [&_.ProseMirror_ul]:list-disc
                                        [&_.ProseMirror_ul]:ml-6

                                        [&_.ProseMirror_ol]:list-decimal
                                        [&_.ProseMirror_ol]:ml-6

                                        [&_.ProseMirror_blockquote]:border-l-4
                                        [&_.ProseMirror_blockquote]:pl-4
                                        [&_.ProseMirror_blockquote]:italic

                                        [&_.ProseMirror_img]:my-4
                                        [&_.ProseMirror_img]:rounded-none
                                        [&_.ProseMirror_img:hover]:ring-2
                                        [&_.ProseMirror_img:hover]:ring-primary
                                        [&_.ProseMirror_img:hover]:ring-offset-2

                                        [&_.ProseMirror_.ProseMirror-selectednode]:outline-none
                                        [&_.ProseMirror_.ProseMirror-selectednode_img]:ring-2
                                        [&_.ProseMirror_.ProseMirror-selectednode_img]:ring-primary
                                        [&_.ProseMirror_.ProseMirror-selectednode_img]:ring-offset-2
                                        [&_.ProseMirror_.ProseMirror-selectednode_img]:opacity-90

                                        [&_.ProseMirror_a]:text-primary
                                        [&_.ProseMirror_a]:underline
                                        [&_.ProseMirror_a]:underline-offset-4
                                        [&_.ProseMirror_a]:font-medium
                                        [&_.ProseMirror_a]:transition-colors
                                        [&_.ProseMirror_a:hover]:opacity-80

                                        [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
                                        [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground
                                        [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
                                        [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
                                        [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
                                    "
                                />

                                <ImageModal
                                    folder="berita"
                                    open={showImageModal}
                                    onClose={() =>
                                        setShowImageModal(false)
                                    }
                                    onInsert={(url) => {
                                        uploadedRef.current.push(url)

                                        editor
                                            ?.chain()
                                            .focus()
                                            .setImage({
                                                src: url,
                                                alt: "",
                                                title: "",
                                                align: "center",
                                                size: "large",
                                            })
                                            .run()

                                        setImageForm({
                                            src: url,
                                            alt: "",
                                            title: "",
                                            align: "center",
                                            size: "large",
                                        })

                                        setShowImageSetting(true)
                                    }}
                                />

                                <LinkModal
                                    open={showLinkModal}
                                    onClose={() =>
                                        setShowLinkModal(false)
                                    }
                                    defaultUrl={linkForm.url}
                                    defaultText={linkForm.text}
                                    onRemove={() => {
                                        editor
                                            ?.chain()
                                            .focus()
                                            .unsetLink()
                                            .run()
                                    }}
                                    onInsert={(url, text) => {
                                        if (
                                            editor?.state.selection.empty &&
                                            text
                                        ) {
                                            editor
                                                ?.chain()
                                                .focus()
                                                .insertContent(
                                                    `<a href="${url}">${text}</a>`
                                                )
                                                .run()
                                        } else {
                                            editor
                                                ?.chain()
                                                .focus()
                                                .setLink({ href: url })
                                                .run()
                                        }
                                    }}
                                />

                                <Dialog
                                    open={showImageSetting}
                                    onOpenChange={setShowImageSetting}
                                >
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Pengaturan Gambar
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-5">
                                            <div className="space-y-2">
                                                <Label>Teks Alt</Label>
                                                <Input
                                                    value={imageForm.alt}
                                                    onChange={(e) =>
                                                        setImageForm({
                                                            ...imageForm,
                                                            alt: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Teks Judul</Label>
                                                <Input
                                                    value={imageForm.title}
                                                    onChange={(e) =>
                                                        setImageForm({
                                                            ...imageForm,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Posisi</Label>
                                                <div className="flex gap-2">
                                                    {[
                                                        { label: "Kiri", value: "left" },
                                                        { label: "Tengah", value: "center" },
                                                        { label: "Kanan", value: "right" },
                                                    ].map((item) => (
                                                        <Button
                                                            key={item.value}
                                                            type="button"
                                                            variant={
                                                                imageForm.align === item.value
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className={
                                                                imageForm.align !== item.value
                                                                    ? "hover:bg-muted hover:text-foreground"
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                setImageForm({
                                                                    ...imageForm,
                                                                    align: item.value,
                                                                })
                                                            }
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Ukuran</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { label: "Kecil", value: "small" },
                                                        { label: "Sedang", value: "medium" },
                                                        { label: "Besar", value: "large" },
                                                        { label: "Full", value: "full" },
                                                    ].map((item) => (
                                                        <Button
                                                            key={item.value}
                                                            type="button"
                                                            variant={
                                                                imageForm.size === item.value
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className={
                                                                imageForm.size !== item.value
                                                                    ? "hover:bg-muted hover:text-foreground"
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                setImageForm({
                                                                    ...imageForm,
                                                                    size: item.value,
                                                                })
                                                            }
                                                        >
                                                            {item.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                variant="default"
                                                className="w-full"
                                                onClick={() => {
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .updateAttributes("image", {
                                                            alt: imageForm.alt,
                                                            title: imageForm.title,
                                                            align: imageForm.align,
                                                            size: imageForm.size,
                                                        })
                                                        .run()

                                                    setShowImageSetting(false)
                                                }}
                                            >
                                                Simpan Pengaturan
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Perubahan Belum Disimpan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ada perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelLeave}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmLeave}>
                            Tinggalkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
