export type JamBukaItem = {
    id: number;
    hari: number;
    shif: string;
    mode: string;
    jam_buka: string | null;
    jam_tutup: string | null;
};

export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const URUTAN_HARI = [1, 2, 3, 4, 5, 6, 0];

const KAPITAL_SHIF: Record<string, string> = { pagi: 'Pagi', siang: 'Siang', malam: 'Malam' };

export function formatJam(jb: JamBukaItem): string {
    const buka = jb.jam_buka ? jb.jam_buka.slice(0, 5) : '';
    const tutup = jb.jam_tutup ? jb.jam_tutup.slice(0, 5) : '';

    return `${buka}–${tutup}`;
}

export function shiftsHari(jamBuka: JamBukaItem[] | undefined, hari: number): string[] {
    return (jamBuka ?? [])
        .filter((jb) => jb.hari === hari && jb.mode === 'custom' && jb.jam_buka && jb.jam_tutup)
        .map((jb) => `${KAPITAL_SHIF[jb.shif] ?? jb.shif} ${formatJam(jb)}`);
}

export function statusHariIni(jamBuka: JamBukaItem[] | undefined, now = new Date()) {
    const hari = now.getDay();
    const sekarang = now.getHours() * 60 + now.getMinutes();
    const shifts = shiftsHari(jamBuka, hari);
    const sedangBuka = (jamBuka ?? [])
        .filter((jb) => jb.hari === hari && jb.mode === 'custom' && jb.jam_buka && jb.jam_tutup)
        .some((jb) => {
            const [hb, mb] = (jb.jam_buka ?? '').split(':').map(Number);
            const [ht, mt] = (jb.jam_tutup ?? '').split(':').map(Number);

            if (Number.isNaN(hb) || Number.isNaN(ht)) {
                return false;
            }

            return sekarang >= hb * 60 + mb && sekarang < ht * 60 + mt;
        });

    return {
        hari,
        shifts,
        sedangBuka,
    };
}
