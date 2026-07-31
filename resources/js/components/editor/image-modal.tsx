import {
    ImagePlus,
    Link2,
    Upload,
    X,
    Loader2,
} from "lucide-react"
import {
    useEffect,
    useRef,
    useState,
} from "react"
import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"



import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Separator } from "@/components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"




interface Props {
    open: boolean
    onClose: () => void
    onInsert: (url: string) => void
}

export default function ImageModal({
    open,
    onClose,
    onInsert,
}: Props) {
    const [tab, setTab] =
        useState<"url" | "upload">("upload")

    const [url, setUrl] = useState("")

    const [uploading, setUploading] =
        useState(false)

    const [preview, setPreview] =
        useState<string | null>(null)

    const [isDragOver, setIsDragOver] = useState(false)
    const dragCounterRef = useRef(0)

    const fileRef =
        useRef<HTMLInputElement | null>(null)

    const resetModal = () => {
        setTab("upload")
        setUrl("")
        setUploading(false)
        setPreview(null)

        if (fileRef.current) {
            fileRef.current.value = ""
        }
    }

    useEffect(() => {
        if (!open) {
            resetModal()
        }
    }, [open])

    const handleClose = () => {
        resetModal()
        onClose()
    }

    const doUpload = async (file: File) => {
        setPreview(
            URL.createObjectURL(file)
        )

        const formData = new FormData()

        formData.append("file", file)

        try {
            setUploading(true)

            const csrfEl = document.querySelector(
                'meta[name="csrf-token"]'
            ) as HTMLMetaElement

            const csrf = csrfEl?.content

            console.log("CSRF meta:", csrfEl, "CSRF value:", csrf)

            const response = await fetch(
                "/admin/upload-image",
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest",

                        ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                    },
                }
            )

            console.log("Upload response status:", response.status)

            if (!response.ok) {
                const text = await response.text()
                console.error("Upload error body:", text)
                alert("Upload gagal (status " + response.status + ")")

                return
            }

            const data = await response.json()

            console.log("Upload response data:", data)

            if (data.url) {
                onInsert(data.url)

                resetModal()

                onClose()
            } else {
                alert("Upload gagal: URL tidak ditemukan dalam response")
            }
        } catch (error) {
            console.error(error)

            alert("Upload gagal: " + (error instanceof Error ? error.message : "Unknown error"))
        } finally {
            setUploading(false)
        }
    }

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) {
return
}

        await doUpload(file)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleClose}
        >
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <Heading
                        variant="small"
                        title="Insert Image"
                        description="Upload gambar atau gunakan URL gambar."
                    />

                    <Separator />
                </DialogHeader>

                <Tabs
                    value={tab}
                    onValueChange={(v) =>
                        setTab(
                            v as
                                | "url"
                                | "upload"
                        )
                    }
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </TabsTrigger>

                        <TabsTrigger value="url">
                            <Link2 className="mr-2 h-4 w-4" />
                            Via URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="upload"
                        className="space-y-4 pt-4"
                    >
                        <label
                            className={`
                                relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3
                                rounded-lg border-2 border-dashed p-8
                                transition-colors
                                ${isDragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                }
                                ${uploading ? "pointer-events-none opacity-60" : ""}
                            `}
                            onDragOver={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onDragEnter={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dragCounterRef.current++
                                setIsDragOver(true)
                            }}
                            onDragLeave={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dragCounterRef.current--

                                if (dragCounterRef.current <= 0) {
                                    dragCounterRef.current = 0
                                    setIsDragOver(false)
                                }
                            }}
                            onDrop={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                dragCounterRef.current = 0
                                setIsDragOver(false)
                                const file = e.dataTransfer?.files?.[0]

                                if (file?.type.startsWith("image/")) {
                                    await doUpload(file)
                                }
                            }}
                        >
                            <Input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                            />

                            {preview ? (
                                <div className="relative w-full max-w-xs">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-[200px] w-full rounded-lg object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setPreview(null)

                                            if (fileRef.current) {
                                                fileRef.current.value = ""
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : uploading ? (
                                <div className="text-center space-y-2">
                                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm font-medium text-foreground">Mengupload...</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {isDragOver ? "Lepaskan gambar di sini" : "Seret gambar ke sini"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            atau klik untuk pilih file
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, WebP maksimal 5MB
                                    </p>
                                </div>
                            )}
                        </label>
                    </TabsContent>

                    <TabsContent
                        value="url"
                        className="space-y-4 pt-4"
                    >
                        <div>
                            <Label className="pb-2">
                                URL Gambar
                            </Label>

                            <Input
                                type="text"
                                placeholder="https://..."
                                value={url}
                                onChange={(e) =>
                                    setUrl(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {url && (
                            <div
                                className="
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    bg-muted
                                "
                            >
                                <img
                                    src={url}
                                    alt="Preview"
                                    className="
                                        max-h-[300px]
                                        w-full
                                        object-contain
                                    "
                                />
                            </div>
                        )}

                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                if (!url) {
return
}

                                onInsert(url)

                                resetModal()

                                onClose()
                            }}
                        >
                            <ImagePlus className="mr-2 h-4 w-4" />

                            Insert Image
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
