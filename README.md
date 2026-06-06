# MajorMatch

MajorMatch adalah aplikasi rekomendasi jurusan berbasis forward chaining yang berjalan sebagai static web app.

## Fitur

- Landing page informatif.
- Test jurusan tanpa login.
- Rekomendasi jurusan dihitung langsung di browser.
- Daftar jurusan dan kampus Indonesia.
- Tabel basis aturan forward chaining.
- Riwayat Test terbuka menggunakan `localStorage`.

## Teknologi

- Vite
- Vanilla JavaScript
- CSS custom
- `localStorage` untuk riwayat lokal

## Menjalankan Lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output build ada di folder `dist`.

## Deploy Vercel

Import repository ke Vercel. Vercel akan menjalankan:

- Build command: `npm run build`
- Output directory: `dist`
