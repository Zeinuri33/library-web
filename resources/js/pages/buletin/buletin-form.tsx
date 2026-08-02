"use client"

import { FileText, UploadCloud, X } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BuletinData = {
    edisi: string
    tanggal_terbit: string
    file_pdf: File | null
}

type BuletinFormFieldsProps = {
    data: BuletinData
    setData: (key: keyof BuletinData, value: any) => void
    errors: Partial<Record<keyof BuletinData, string>>
    existingPdfUrl?: string | null
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) {
        return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function BuletinFormFields({
    data,
    setData,
    errors,
    existingPdfUrl,
}: BuletinFormFieldsProps) {
    const [dragging, setDragging] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const preview = previewUrl ?? existingPdfUrl ?? null

    const handleFiles = (files: FileList | null) => {
        const file = files?.[0]

        if (!file) {
            return
        }

        if (file.type !== "application/pdf") {
            toast("Hanya file PDF yang diperbolehkan")

            return
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        setData("file_pdf", file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }

        setPreviewUrl(null)
        setData("file_pdf", null)

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Edisi</Label>
                <Input
                    value={data.edisi}
                    onChange={(e) =>
                        setData("edisi", e.target.value.replace(/\D/g, ""))
                    }
                    inputMode="numeric"
                    placeholder="Contoh: 1"
                />
                {errors.edisi && (
                    <p className="text-sm text-destructive">{errors.edisi}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Tanggal Terbit</Label>
                <Input
                    type="date"
                    value={data.tanggal_terbit}
                    onChange={(e) =>
                        setData("tanggal_terbit", e.target.value)
                    }
                />
                {errors.tanggal_terbit && (
                    <p className="text-sm text-destructive">
                        {errors.tanggal_terbit}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>File PDF</Label>

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault()
                        setDragging(false)
                        handleFiles(e.dataTransfer.files)
                    }}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
                        dragging
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/40"
                    }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UploadCloud className="h-6 w-6" />
                    </div>

                    <p className="text-sm font-medium">
                        Seret file PDF ke sini atau klik untuk memilih
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Format PDF, maksimal 10 MB
                    </p>
                </div>

                {data.file_pdf && (
                    <div className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-muted/40 px-3 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <div className="min-w-0">
                                <p className="truncate text-sm">
                                    {data.file_pdf.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatSize(data.file_pdf.size)}
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            className="h-7 w-7 text-muted-foreground hover:!bg-destructive/10 hover:!text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {preview && (
                    <div className="mt-3 overflow-hidden rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5">
                            <p className="text-xs font-medium text-muted-foreground">
                                Pratinjau PDF
                            </p>
                            <a
                                href={preview}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Buka di tab baru
                            </a>
                        </div>
                        <iframe
                            src={preview}
                            title="Pratinjau PDF"
                            className="h-56 w-full"
                        />
                    </div>
                )}

                {errors.file_pdf && (
                    <p className="text-sm text-destructive">
                        {errors.file_pdf}
                    </p>
                )}
            </div>
        </div>
    )
}
