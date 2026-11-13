# KLINIK AI — Smart Technology Assistant

KLINIK AI adalah website bantuan teknologi yang membantu pengguna mengenali masalah umum pada komputer, printer, jaringan, file, aplikasi, dan keamanan digital.

## Fitur
- Dashboard dan kategori masalah
- Diagnosis interaktif berbasis aturan lokal
- Rekomendasi penyelesaian langkah demi langkah
- Pusat pengetahuan dengan pencarian artikel
- Riwayat diagnosis menggunakan `localStorage`
- Tampilan responsif untuk desktop dan ponsel
- Tidak membutuhkan API key atau server

## Cara menjalankan di komputer
1. Unduh atau clone repository ini.
2. Pastikan `index.html`, `style.css`, dan `app.js` berada dalam folder yang sama.
3. Buka `index.html` menggunakan browser.

## Cara memasang di GitHub Pages
1. Masuk ke GitHub dan buat repository baru, misalnya `klinik-ai`.
2. Upload `index.html`, `style.css`, `app.js`, dan `README.md` ke bagian utama (root) repository.
3. Buka **Settings → Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu proses publikasi. GitHub akan menampilkan alamat website pada halaman Pages.

## Catatan tentang fitur AI
Versi ini memakai mesin diagnosis berbasis aturan (rule-based) di browser. Ia mencocokkan kata kunci dan kategori dengan panduan yang sudah disiapkan. Jadi, website dapat digunakan tanpa API eksternal, tetapi belum melakukan percakapan AI generatif atau memahami semua variasi bahasa secara mendalam.

Untuk menghubungkan model AI sungguhan, gunakan backend/serverless function yang menyimpan API key secara aman. **Jangan menaruh API key rahasia langsung di `app.js` atau file JavaScript publik GitHub.**

## Struktur proyek
```text
klinik-ai/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Pengembangan berikutnya
- Integrasi AI generatif melalui backend aman
- Unggah foto pesan error untuk dianalisis
- Akun pengguna dan sinkronisasi riwayat
- Panel admin untuk menambah artikel solusi

## Lisensi
Bebas digunakan dan dikembangkan untuk kebutuhan pembelajaran. Periksa kembali akurasi panduan sebelum digunakan sebagai prosedur teknis resmi.
