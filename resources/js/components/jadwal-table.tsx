"use client"

import { NAMA_HARI, URUTAN_HARI, shiftsHari } from "@/lib/jam-buka"
import type { JamBukaItem } from "@/lib/jam-buka"

export function StatusPill({ sedangBuka }: { sedangBuka: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                sedangBuka
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    sedangBuka ? "animate-pulse bg-white" : "bg-current"
                }`}
            />
            {sedangBuka ? "Sedang Buka" : "Saat Ini Tutup"}
        </span>
    )
}

export function JadwalTable({
    jamBuka,
    compact = false,
}: {
    jamBuka?: JamBukaItem[]
    compact?: boolean
}) {
    const today = new Date().getDay()

    return (
        <table className="w-full border-collapse">
            <tbody>
                {URUTAN_HARI.map((h) => {
                    const isToday = h === today
                    const shifts = shiftsHari(jamBuka, h)

                    return (
                        <tr
                            key={h}
                            className={`border-b border-gray-100 last:border-0 dark:border-gray-800 ${
                                isToday ? "bg-emerald-500/10 dark:bg-emerald-500/15" : ""
                            }`}
                        >
                            <td className={compact ? "px-3 py-1.5" : "px-4 py-2.5"}>
                                <span
                                    className={`flex items-center gap-2 font-medium ${
                                        isToday
                                            ? "text-emerald-700 dark:text-emerald-400"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {NAMA_HARI[h]}
                                    {isToday && (
                                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">
                                            Hari Ini
                                        </span>
                                    )}
                                </span>
                            </td>
                            <td
                                className={`text-right ${
                                    compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
                                } ${
                                    isToday
                                        ? "font-bold text-emerald-700 dark:text-emerald-400"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                {shifts.length === 0 ? (
                                    "Tutup"
                                ) : (
                                    <div className="flex flex-col items-end gap-0.5">
                                        {shifts.map((s) => (
                                            <span key={s}>{s}</span>
                                        ))}
                                    </div>
                                )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
