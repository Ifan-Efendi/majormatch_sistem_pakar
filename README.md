# MajorMatch

MajorMatch adalah aplikasi web statis untuk membantu pengguna menemukan rekomendasi jurusan kuliah berdasarkan minat dan kecenderungan diri. Aplikasi ini menggunakan pendekatan sistem pakar sederhana dengan metode forward chaining berbasis aturan IF-THEN.

Project ini berjalan sepenuhnya di browser, tanpa login, tanpa database, dan tanpa server backend. Data jurusan, kampus, indikator minat, serta basis aturan disimpan di file JavaScript lokal.

## Fitur

- Landing page MajorMatch.
- Test rekomendasi jurusan tanpa login.
- Input profil singkat: nama, jenjang, dan asal kota.
- Pemilihan fakta minat menggunakan checkbox.
- Rekomendasi jurusan berdasarkan aturan IF-THEN.
- Halaman hasil berisi jurusan terpilih, minat pendukung, alasan rekomendasi, prospek karier, dan kampus terkait.
- Daftar jurusan yang tersedia.
- Detail jurusan.
- Daftar kampus Indonesia.
- Halaman tentang berisi penjelasan forward chaining dan tabel basis aturan.
- Riwayat test disimpan di browser pengguna menggunakan `localStorage`.

## Teknologi

- Vite sebagai build tool frontend.
- Vanilla JavaScript untuk routing, logic test, forward chaining, dan penyimpanan lokal.
- CSS custom untuk tampilan responsif.
- HTML statis sebagai entry point aplikasi.
- `sessionStorage` untuk menyimpan profil dan hasil test aktif.
- `localStorage` untuk menyimpan riwayat test di browser.
- Vercel sebagai target hosting static web app.

## Cara Kerja Sistem

MajorMatch menggunakan fakta minat yang dipilih pengguna sebagai fakta awal. Setiap pilihan minat yang dicentang akan menjadi fakta dalam proses forward chaining.

Contoh sederhana:

```text
Fakta awal:
- Suka logika
- Tertarik teknologi
- Suka pemrograman
- Suka memecahkan masalah

Rule:
IF Suka logika
AND Tertarik teknologi
AND Suka pemrograman
AND Suka memecahkan masalah
THEN rekomendasikan Teknik Informatika
```

Alur kerjanya:

1. Pengguna mengisi profil singkat.
2. Pengguna mencentang minat yang sesuai.
3. Sistem mengubah minat yang dicentang menjadi fakta awal.
4. Sistem memeriksa semua rule di basis pengetahuan.
5. Jika seluruh kondisi IF dalam sebuah rule terpenuhi, sistem menarik kesimpulan THEN.
6. Jurusan yang memenuhi rule ditampilkan sebagai hasil rekomendasi.
7. Jika beberapa rule mengarah ke jurusan yang sama, hasilnya digabung dalam satu card jurusan.

Sistem tidak menggunakan skor persentase. Rule hanya dianggap terpenuhi jika seluruh fakta yang dibutuhkan oleh rule tersebut dipilih oleh pengguna.

## Struktur Folder

```text
.
|-- index.html
|-- public/
|   `-- favicon.svg
|-- src/
|   |-- data.js
|   |-- main.js
|   `-- styles.css
|-- vite.config.js
|-- vercel.json
|-- package.json
`-- README.md
```

Keterangan:

- `index.html`: entry utama aplikasi.
- `public/favicon.svg`: ikon tab browser.
- `src/data.js`: data indikator, jurusan, kampus, dan rule IF-THEN.
- `src/main.js`: logic aplikasi, hash router, test, hasil rekomendasi, dan riwayat.
- `src/styles.css`: styling seluruh tampilan.
- `vite.config.js`: konfigurasi Vite.
- `vercel.json`: konfigurasi rewrite untuk deploy SPA di Vercel.
- `dist/`: output production setelah menjalankan build.

## Cara Menjalankan Lokal

Pastikan Node.js dan npm sudah terinstall.

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Setelah itu buka URL yang muncul di terminal, biasanya:

```text
http://localhost:5173
```

Jika ingin membuka dari HP dalam jaringan Wi-Fi yang sama, gunakan IP laptop:

```text
http://IP-LAPTOP:5173
```

Contoh:

```text
http://192.168.1.10:5173
```

## Build Production

Untuk membuat versi production:

```bash
npm run build
```

Output production akan dibuat di folder:

```text
dist
```

## Preview Build

Untuk melihat hasil build production secara lokal:

```bash
npm run preview
```

## Deploy ke Vercel

Pengaturan Vercel:

- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

File `vercel.json` sudah menyediakan rewrite agar hash/router aplikasi tetap aman saat di-deploy.

## Catatan Pengembangan

- Menambah indikator: edit array `indicators` di `src/data.js`.
- Menambah jurusan: edit array `majors` di `src/data.js`.
- Menambah kampus: edit array `campuses` di `src/data.js`.
- Mengubah basis aturan: edit array `rules` di `src/data.js`.
- Jangan menambahkan database atau login admin kecuali kebutuhan aplikasi berubah.

## Status

MajorMatch dibuat sebagai project sistem pakar sederhana untuk rekomendasi jurusan kuliah berbasis minat pengguna.
