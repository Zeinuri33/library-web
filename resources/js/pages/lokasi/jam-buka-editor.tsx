"use client"

import { ArrowLeftRight, Check, Copy, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const DAYS = [
    { value: 6, label: "Sabtu" },
    { value: 0, label: "Minggu" },
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
]

export const SHIFTS = [
    { value: "pagi", label: "Pagi" },
    { value: "siang", label: "Siang" },
    { value: "malam", label: "Malam" },
] as const

export type Shif = (typeof SHIFTS)[number]["value"]

export type ModeJamBuka = "custom" | "closed"

export type JamBukaItem = {
    hari: number
    shif: Shif
    mode: ModeJamBuka
    jam_buka: string | null
    jam_tutup: string | null
}

export const MODE_LABEL: Record<ModeJamBuka, string> = {
    custom: "Jam Kustom",
    closed: "Tutup",
}

export const JAM_DEFAULT: Record<Shif, { buka: string; tutup: string }> = {
    pagi: { buka: "07:00", tutup: "11:00" },
    siang: { buka: "13:00", tutup: "17:00" },
    malam: { buka: "20:30", tutup: "22:00" },
}

export function defaultJamBuka(hari: number, shif: Shif): JamBukaItem {
    return {
        hari,
        shif,
        mode: "custom",
        jam_buka: JAM_DEFAULT[shif].buka,
        jam_tutup: JAM_DEFAULT[shif].tutup,
    }
}

export function labelWaktu(item: JamBukaItem): string {
    if (item.mode === "closed") {
        return "Tutup"
    }

    if (item.jam_buka && item.jam_tutup) {
        return `${item.jam_buka}–${item.jam_tutup}`
    }

    return "—"
}

export function ringkasanJamBuka(items: JamBukaItem[]): string {
    const byKey = new Map(
        items.map((item) => [`${item.hari}-${item.shif}`, item] as const)
    )

    const urutanHari = [6, 0, 1, 2, 3, 4, 5]

    const polaHari = (hari: number): string | null => {
        const parts: string[] = []

        for (const s of SHIFTS) {
            const item = byKey.get(`${hari}-${s.value}`)

            if (!item) {
                return null
            }

            if (item.mode === "closed") {
                continue
            }

            parts.push(`${s.label} ${labelWaktu(item)}`)
        }

        if (parts.length === 0) {
            return null
        }

        return parts.join(", ")
    }

    const format = (s: number, e: number, pola: string) => {
        const a = DAYS[s].label
        const b = DAYS[e].label

        return s === e ? `${a}: ${pola}` : `${a.slice(0, 3)}–${b.slice(0, 3)}: ${pola}`
    }

    const ranges: string[] = []
    let start: number | null = null
    let prev = 0
    let prevPola = ""

    for (const i of urutanHari) {
        const pola = polaHari(i)

        if (pola === null) {
            if (start !== null) {
                ranges.push(format(start, prev, prevPola))
                start = null
            }

            continue
        }

        if (start === null) {
            start = i
            prev = i
            prevPola = pola

            continue
        }

        if (pola === prevPola && (prev + 1) % 7 === i) {
            prev = i

            continue
        }

        ranges.push(format(start, prev, prevPola))
        start = i
        prev = i
        prevPola = pola
    }

    if (start !== null) {
        ranges.push(format(start, prev, prevPola))
    }

    if (ranges.length === 0) {
        return "Belum diatur"
    }

    const joined = ranges.slice(0, 3).join(", ")

    return ranges.length > 3 ? `${joined} …` : joined
}

type Preset = {
    id: string
    label: string
    build: () => JamBukaItem[]
}

const PRESETS: Preset[] = [
    {
        id: "tiga-shif",
        label: "Seminggu: Pagi + Siang + Malam",
        build: () =>
            DAYS.flatMap((d) =>
                SHIFTS.map(
                    (s): JamBukaItem => ({
                        hari: d.value,
                        shif: s.value,
                        mode: "custom",
                        jam_buka: JAM_DEFAULT[s.value].buka,
                        jam_tutup: JAM_DEFAULT[s.value].tutup,
                    })
                )
            ),
    },
    {
        id: "pagi-saja",
        label: "Seminggu: Pagi saja",
        build: () =>
            DAYS.flatMap((d) =>
                SHIFTS.map(
                    (s): JamBukaItem => ({
                        hari: d.value,
                        shif: s.value,
                        mode: s.value === "pagi" ? "custom" : "closed",
                        jam_buka: s.value === "pagi" ? JAM_DEFAULT.pagi.buka : null,
                        jam_tutup: s.value === "pagi" ? JAM_DEFAULT.pagi.tutup : null,
                    })
                )
            ),
    },
    {
        id: "kerja",
        label: "Senin–Jumat 3 shif, akhir pekan tutup",
        build: () =>
            DAYS.flatMap((d) => {
                const buka = d.value >= 1 && d.value <= 5

                return SHIFTS.map(
                    (s): JamBukaItem => ({
                        hari: d.value,
                        shif: s.value,
                        mode: buka ? "custom" : "closed",
                        jam_buka: buka ? JAM_DEFAULT[s.value].buka : null,
                        jam_tutup: buka ? JAM_DEFAULT[s.value].tutup : null,
                    })
                )
            }),
    },
    {
        id: "tutup",
        label: "Semua shif tutup",
        build: () =>
            DAYS.flatMap((d) =>
                SHIFTS.map(
                    (s): JamBukaItem => ({
                        hari: d.value,
                        shif: s.value,
                        mode: "closed",
                        jam_buka: null,
                        jam_tutup: null,
                    })
                )
            ),
    },
]

const TARGET_LABEL: Record<"all" | "weekday" | "weekend", string> = {
    all: "Semua Hari",
    weekday: "Senin–Jumat",
    weekend: "Sabtu–Minggu",
}

const TARGET_DAYS: Record<"all" | "weekday" | "weekend", number[]> = {
    all: [0, 1, 2, 3, 4, 5, 6],
    weekday: [1, 2, 3, 4, 5],
    weekend: [0, 6],
}

type Target = keyof typeof TARGET_DAYS

export function JamBukaEditor({
    value,
    onChange,
}: {
    value: JamBukaItem[]
    onChange: (items: JamBukaItem[]) => void
}) {
    const [feedback, setFeedback] = useState<string | null>(null)

    useEffect(() => {
        if (!feedback) {
            return
        }

        const timer = setTimeout(() => setFeedback(null), 2200)

        return () => clearTimeout(timer)
    }, [feedback])

    const itemFor = (hari: number, shif: Shif) =>
        value.find((item) => item.hari === hari && item.shif === shif)

    const update = (hari: number, shif: Shif, patch: Partial<JamBukaItem>) => {
        onChange(
            value.map((item) =>
                item.hari === hari && item.shif === shif
                    ? { ...item, ...patch }
                    : item
            )
        )
    }

    const changeMode = (hari: number, shif: Shif, mode: ModeJamBuka) => {
        const item = itemFor(hari, shif)

        if (!item) {
            return
        }

        if (mode === "custom") {
            update(hari, shif, {
                mode,
                jam_buka: item.jam_buka ?? JAM_DEFAULT[shif].buka,
                jam_tutup: item.jam_tutup ?? JAM_DEFAULT[shif].tutup,
            })

            return
        }

        update(hari, shif, { mode, jam_buka: null, jam_tutup: null })
    }

    const tukarJam = (hari: number, shif: Shif) => {
        const item = itemFor(hari, shif)

        if (!item) {
            return
        }

        update(hari, shif, {
            jam_buka: item.jam_tutup,
            jam_tutup: item.jam_buka,
        })
    }

    const salinHari = (hari: number, target: Target) => {
        const sasaran = TARGET_DAYS[target]
        const sumber = value.filter((item) => item.hari === hari)

        onChange(
            value.map((item) => {
                if (!sasaran.includes(item.hari)) {
                    return item
                }

                const source = sumber.find((s) => s.shif === item.shif)

                return source ? { ...source, hari: item.hari } : item
            })
        )

        setFeedback(`Jadwal ${DAYS[hari].label} → ${TARGET_LABEL[target]}`)
    }

    const salinShif = (hari: number, shif: Shif, target: Target) => {
        const sasaran = TARGET_DAYS[target]
        const sumber = itemFor(hari, shif)

        if (!sumber) {
            return
        }

        onChange(
            value.map((item) =>
                sasaran.includes(item.hari) && item.shif === shif
                    ? { ...sumber, hari: item.hari }
                    : item
            )
        )

        setFeedback(
            `${DAYS[hari].label} ${shif.charAt(0).toUpperCase() + shif.slice(1)} → ${TARGET_LABEL[target]}`
        )
    }

    const CopyMenu = ({
        onCopy,
    }: {
        onCopy: (target: Target) => void
    }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 hover:!bg-muted hover:!text-foreground"
                    title="Salin"
                >
                    <Copy className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                {(["all", "weekday", "weekend"] as const).map((target) => (
                    <DropdownMenuItem
                        key={target}
                        onSelect={() => onCopy(target)}
                        className="focus:!bg-muted focus:!text-foreground"
                    >
                        Salin ke {TARGET_LABEL[target]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <div className="space-y-4">
            {/* HEADER + RINGKASAN */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">Jam Buka</h3>
                    {value.length > 0 && (
                        <Badge variant="outline" className="max-w-full truncate">
                            {ringkasanJamBuka(value)}
                        </Badge>
                    )}
                </div>

                {feedback && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Check className="h-3.5 w-3.5" />
                        Tersalin: {feedback}
                    </div>
                )}
            </div>

            {/* PRESET */}
            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Terapkan pola cepat
                </p>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <Button
                            key={preset.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="hover:!bg-muted hover:!text-foreground"
                            onClick={() => onChange(preset.build())}
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* GRID HARI x SHIF */}
            <div className="overflow-x-auto">
                <div className="min-w-[560px]">
                    <div className="grid grid-cols-3 gap-2">
                        {SHIFTS.map((s) => (
                            <div
                                key={s.value}
                                className="pl-2 text-sm font-semibold"
                            >
                                Shif {s.label}
                            </div>
                        ))}
                    </div>

                    {DAYS.map((day) => {
                        const lengkap = SHIFTS.every(
                            (s) => itemFor(day.value, s.value) !== undefined
                        )

                        return (
                            <div key={day.value} className="mt-4">
                                <div className="mb-1.5 flex items-center justify-between gap-1 rounded-lg border bg-background/60 px-2.5 py-1.5">
                                    <span className="text-sm font-medium">
                                        {day.label}
                                    </span>
                                    {lengkap && (
                                        <CopyMenu
                                            onCopy={(target) =>
                                                salinHari(day.value, target)
                                            }
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2">

                                {SHIFTS.map((s) => {
                                    const item = itemFor(day.value, s.value)

                                    if (!item) {
                                        return (
                                            <div
                                                key={s.value}
                                                className="rounded-lg border border-dashed bg-background/40 px-2 py-2 text-xs text-muted-foreground flex items-center justify-center"
                                            >
                                                —
                                            </div>
                                        )
                                    }

                                    return (
                                        <div
                                            key={s.value}
                                            className="relative rounded-lg border bg-background/60 p-2 pt-8"
                                        >
                                            <div className="absolute top-1 right-1">
                                                <CopyMenu
                                                    onCopy={(target) =>
                                                        salinShif(
                                                            day.value,
                                                            s.value,
                                                            target
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={item.mode}
                                                    onValueChange={(v) =>
                                                        changeMode(
                                                            day.value,
                                                            s.value,
                                                            v as ModeJamBuka
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-7 w-full text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(
                                                            Object.keys(
                                                                MODE_LABEL
                                                            ) as ModeJamBuka[]
                                                        ).map((mode) => (
                                                            <SelectItem
                                                                key={mode}
                                                                value={mode}
                                                                className="focus:!bg-muted focus:!text-foreground"
                                                            >
                                                                {MODE_LABEL[mode]}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Badge
                                                    variant={
                                                        item.mode === "closed"
                                                            ? "destructive"
                                                            : "outline"
                                                    }
                                                    className={
                                                        item.mode === "custom"
                                                            ? "h-7 shrink-0 border-transparent bg-blue-500 text-white"
                                                            : "h-7 shrink-0"
                                                    }
                                                >
                                                    {labelWaktu(item)}
                                                </Badge>
                                            </div>

                                            {item.mode === "custom" ? (
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <Input
                                                        type="time"
                                                        className="h-8 text-xs"
                                                        value={item.jam_buka ?? ""}
                                                        onChange={(e) =>
                                                            update(
                                                                day.value,
                                                                s.value,
                                                                {
                                                                    jam_buka:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        –
                                                    </span>
                                                    <Input
                                                        type="time"
                                                        className="h-8 text-xs"
                                                        value={item.jam_tutup ?? ""}
                                                        onChange={(e) =>
                                                            update(
                                                                day.value,
                                                                s.value,
                                                                {
                                                                    jam_tutup:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-7 shrink-0 hover:!bg-muted hover:!text-foreground"
                                                        title="Tukar jam buka & tutup"
                                                        onClick={() =>
                                                            tukarJam(
                                                                day.value,
                                                                s.value
                                                            )
                                                        }
                                                    >
                                                        <ArrowLeftRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    Tempat tutup di shif ini
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
