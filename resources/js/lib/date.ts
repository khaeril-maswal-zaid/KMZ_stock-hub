/**
 * Format tanggal ISO (misalnya dari Laravel) ke format kalender Indonesia.
 * Contoh input: "2025-10-25T06:23:32.000000Z"
 * Output: "25 Oktober 2025, 13:23 WIB"
 */
export function formatDateIna(dateString: string): string {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // hour12: false,
        // timeZone: 'Asia/Jakarta',
    };

    // Gunakan Intl API dengan locale Indonesia
    const formatted = new Intl.DateTimeFormat('id-ID', options).format(date);
    return formatted;
}
