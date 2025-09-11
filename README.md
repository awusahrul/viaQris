
![Banner](/public/banner.png)

# viaQris ~ Dinamis

[![Ikuti Saluran WhatsApp](https://img.shields.io/badge/Ikuti%20di-WhatsApp-green?logo=whatsapp)](https://whatsapp.com/channel/0029Vb6WmoKGpLHOdbB4NS3I)
[![Versi](https://img.shields.io/badge/Versi-2.0-blueviolet)](https://github.com/awusahrul/viaQris)
![Lisensi MIT](https://img.shields.io/badge/Lisensi-MIT-blue.svg)

```💬 "Memberi dukungan kini semudah scan QR."
Halaman Dukungan Kreator 100% Gratis yang Dikelola Sepenuhnya via GitHub.
````

Selamat datang di **viaQris\!** 🎉

**viaQris** adalah platform dukungan kreator yang membuat apresiasi jadi **mudah, cepat, dan fleksibel**. Siapa pun bisa mengirim dukungan instan ke kreator favoritnya melalui **QRIS**, yang kompatibel dengan **semua e-wallet dan bank**, tanpa ribet.

-----

## ✨ Fitur Utama

  * ✅ **Gratis & Open Source** – Tanpa biaya platform, tanpa potongan tersembunyi.
  * 💳 **Dukungan Instan via QRIS Dinamis** – QR code unik dibuat untuk setiap nominal transaksi.
  * 📂 **Penyimpanan Data di GitHub** – Gunakan repositori GitHub pribadi Anda sebagai database gratis dan aman.
  * 📊 **Dashboard Transaksi** – Pantau dan kelola semua dukungan yang masuk melalui halaman dashboard.
  * 📱 **Desain Responsif** – Tampilan optimal di desktop & mobile.
  * 📄 **Invoice Dukungan** – Bukti pembayaran bisa diunduh dengan tampilan rapi.
  * ⏳ **Timer Pembayaran** – Mengingatkan penyelesaian transaksi dalam 5 menit.

-----

## 🚀 Dibangun Dengan

  * [Next.js](https://nextjs.org/) – Framework React modern.
  * [React](https://reactjs.org/) – Library untuk antarmuka interaktif.
  * [TypeScript](https://www.typescriptlang.org/) – JavaScript dengan tipe yang lebih aman.
  * [GitHub API](https://docs.github.com/en/rest) – Digunakan sebagai backend untuk menyimpan dan membaca data.
  * [html2canvas](https://html2canvas.hertzen.com/) – Membuat tangkapan layar invoice dari HTML.
  * [qrcode](https://github.com/soldair/node-qrcode) – Generate QR code di sisi server.

-----

## 🛠️ Panduan Instalasi & Deployment

Proses instalasi ini membutuhkan koneksi ke GitHub untuk berfungsi sebagai database.

### Bagian 1: Persiapan Repositori Data

Anda memerlukan repositori **pribadi (private)** terpisah di GitHub untuk menyimpan data transaksi.

1.  Buat repositori baru di GitHub, atur ke **Private**. Contoh nama: `data-viaqris`.
2.  Di dalam repo baru tersebut, buat file di lokasi `public/data.json` dengan isi awal:
    ```json
    {}
    ```

### Bagian 2: Cara Membuat GitHub Token

API membutuhkan token untuk mengakses repositori data Anda.

1.  Buka **Settings** di akun GitHub Anda → **Developer settings**.
2.  Pilih **Personal access tokens** → **Tokens (classic)**.
3.  Klik **Generate new token (classic)**.
4.  Beri nama token (misal: `viaQris API Token`), atur masa berlakunya.
5.  Pada bagian **Select scopes**, centang kotak di sebelah **`repo`**.
6.  Klik **Generate token** dan **segera salin tokennya**.

### Bagian 3: Instalasi Lokal

1.  **Clone Repository `viaQris`**

    ```sh
    git clone [https://github.com/awusahrul/viaQris.git](https://github.com/awusahrul/viaQris.git)
    cd viaQris
    ```

2.  **Instal Dependensi**

    ```sh
    npm install
    ```

3.  **Konfigurasi Environment `.env.local`**
    Buat file `.env.local` di direktori utama `viaQris` dan isi dengan semua variabel berikut:

    ```env
    # Ganti dengan informasi Anda
    GITHUB_TOKEN="ghp_TOKENYANGANDASALINTADI"
    REPO_OWNER="username-github-anda"
    REPO_NAME="nama-repo-data-pribadi-anda" # Contoh: data-viaqris
    BRANCH="main"
    JSON_FILE_PATH="public/data.json"

    # Ganti dengan string QRIS statis Anda yang asli
    DATA_STATIS_QRIS="PASTE_STRING_QRIS_STATIS_ANDA_DI_SINI"
    ```

4.  **Jalankan Server Development**

    ```sh
    npm run dev
    ```

    Buka [http://localhost:3000/dukungan](https://www.google.com/search?q=http://localhost:3000/dukungan) di browser Anda.

### Bagian 4: Deployment ke Vercel

1.  Login ke [Vercel](https://vercel.com) dan impor repositori `viaQris` Anda.
2.  Buka **Project Settings** → **Environment Variables**.
3.  Masukkan **semua variabel** yang ada di file `.env.local` Anda satu per satu.
4.  Klik **Deploy**.

-----

## 🗺️ Roadmap

  - [x] QRIS Dinamis untuk setiap transaksi.
  - [x] Penyimpanan data transaksi via GitHub API.
  - [x] Dashboard Transaksi Interaktif.
  - [ ] Notifikasi dukungan real-time (misalnya via Telegram Bot).
  - [ ] Pilihan kustomisasi tema & tampilan dari halaman dashboard.

-----

## 🤝 Kontribusi

Kontribusi Anda sangat diterima\! Silakan fork repositori ini dan buka *pull request* untuk ide-ide baru.

1.  Fork repositori ini.
2.  Buat branch baru: `git checkout -b fitur/FiturBaru`.
3.  Commit perubahan: `git commit -m 'Tambah FiturBaru'`.
4.  Push branch: `git push origin fitur/FiturBaru`.
5.  Buka Pull Request.

-----

## 📄 Lisensi

Dirilis di bawah **MIT License**. Lihat file `LICENSE` untuk detail.

-----

© 2025 **viaQris** | Dibuat oleh [@awusahrul](https://github.com/awusahrul)
