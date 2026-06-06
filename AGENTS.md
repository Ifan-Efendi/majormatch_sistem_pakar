# MajorMatch

MajorMatch adalah aplikasi web statis untuk membantu pengguna menemukan rekomendasi jurusan kuliah berdasarkan minat dan kecenderungan diri. Aplikasi ini menggunakan pendekatan sistem pakar sederhana dengan metode forward chaining.

## Teknologi

- Vite sebagai build tool frontend.
- Vanilla JavaScript untuk routing, logic test, forward chaining, dan localStorage.
- CSS custom untuk tampilan responsif.
- HTML statis sebagai entry point.
- Vercel sebagai target hosting.

## Karakter Aplikasi

- Semua data jurusan, kampus, indikator, dan rule tersimpan di file JavaScript lokal.
- Riwayat Test disimpan di browser user melalui localStorage.

## Fitur Utama

- Landing page MajorMatch.
- Test rekomendasi jurusan tanpa login.
- Perhitungan rekomendasi jurusan berbasis rule forward chaining.
- Halaman hasil rekomendasi berisi skor kecocokan, alasan, prospek karier, dan kampus terkait.
- Daftar jurusan yang tersedia.
- Detail jurusan.
- Daftar kampus Indonesia.
- Tabel basis aturan forward chaining.
- Riwayat Test terbuka di browser masing-masing user.

## Struktur Folder

- `index.html`: entry utama aplikasi.
- `src/data.js`: data statis indikator, jurusan, kampus, dan rule.
- `src/main.js`: logic aplikasi, router hash, test, hasil, dan riwayat localStorage.
- `src/styles.css`: styling seluruh tampilan.
- `vite.config.js`: konfigurasi Vite.
- `vercel.json`: konfigurasi rewrite untuk deploy SPA di Vercel.
- `dist/`: hasil build, dibuat otomatis oleh `npm run build`.

## Cara Menjalankan Lokal

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Setelah itu buka URL yang muncul di terminal, biasanya:

```bash
http://127.0.0.1:5173
```

## Build Production

```bash
npm run build
```

Output production akan dibuat di folder:

```bash
dist
```

## Preview Build

```bash
npm run preview
```

## Deploy ke Vercel

Pengaturan Vercel:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Catatan Pengembangan

- Jika ingin menambah indikator, edit `src/data.js` pada array `indicators`.
- Jika ingin menambah jurusan, edit `src/data.js` pada array `majors`.
- Jika ingin menambah kampus, edit `src/data.js` pada array `campuses`.
- Jika ingin mengubah rule forward chaining, edit `src/data.js` pada array `rules`.
- Jangan menambahkan database atau login admin kecuali kebutuhan aplikasi berubah.
