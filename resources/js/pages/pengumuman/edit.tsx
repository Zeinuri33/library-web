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

import { Save } from "lucide-react"



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


export default function EditPengumuman({
    pengumuman,
}: {
    pengumuman: {
        id: number
        judul: string
        isi: string
    }
}) {
    const STORAGE_KEY = "edit-pengumuman-draft-" + pengumuman.id

    const [judul, setJudul] = useState(pengumuman.judul || "")

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
        return () => {
            if (!savingRef.current && (isDirty || uploadedRef.current.length > 0)) {
                deleteUploaded()
            }
        }
    }, [isDirty])

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
                placeholder: "Tulis isi pengumuman di sini...",
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

        content: pengumuman.isi || "",
        onUpdate: ({ editor }) => {
            setIsDirty(true)
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    judul,
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

    const handleSubmit = () => {
        if (!editor) {
return
}

        if (!judul.trim()) {
            toast("Judul wajib diisi")

            return
        }

        const html = editor.getHTML()

        if (html === "<p></p>") {
            toast("Konten wajib diisi")

            return
        }

        savingRef.current = true

        router.put(
            `/admin/pengumuman/${pengumuman.id}`,
            {
                judul,
                isi: html,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    savingRef.current = false
                    localStorage.removeItem(STORAGE_KEY)
                    uploadedRef.current = []

                    toast(
                        `Pengumuman ${judul} berhasil diperbarui`,
                        { description: getNow() }
                    )
                },

                onError: () => {
                    savingRef.current = false
                    toast(
                        "Gagal menyimpan pengumuman",
                        { description: "Periksa kembali data." }
                    )
                },
            }
        )
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
        router.visit('/admin/pengumuman')
    }

    const cancelLeave = () => {
        setShowUnsavedDialog(false)
    }

    return (
        <>
            <Head title={`Edit Pengumuman: ${pengumuman.judul}`} />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Edit Pengumuman
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-foreground">
                                Ubah pengumuman menggunakan editor modern.
                            </p>
                        </div>
                    </div>

                    <Link href="/admin/pengumuman" onClick={handleBack}>
                        <Button variant="outline" className="hover:bg-muted hover:text-foreground">
                            Kembali
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
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
                                    p-6
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

                    <div className="space-y-4 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
                            <div className="border-b border-border/80">
                                <div className="px-4 pt-4 pb-5 min-h-[44px] flex items-center">
                                    <h3 className="font-semibold text-base">
                                        Informasi Pengumuman
                                    </h3>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <Label className="pb-2">Judul</Label>
                                    <Input
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Contoh: Libur Hari Kemerdekaan"
                                    />
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    className="w-full gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </Button>
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

EditPengumuman.layout = {
    breadcrumbs: [
        { title: "Pengumuman", href: "/admin/pengumuman" },
        { title: "Edit", href: "" },
    ],
}
