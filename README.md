# StoreMini — Aplikasi Manajemen Produk

Aplikasi frontend sederhana untuk mengelola produk menggunakan [Platzi Fake Store API](https://fakeapi.platzi.com/en/rest/products/). Dibangun dengan React, TypeScript, dan TailwindCSS.

## Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19.x | UI Framework |
| Vite | 8.x | Build Tool & Dev Server |
| TypeScript | 6.x | Type Safety |
| TailwindCSS | 4.x | Styling |
| React Router | 7.x | Client-side Routing |
| React Hook Form | 7.x | Form Management |
| Zod | 4.x | Validasi Schema |
| Axios | 1.x | HTTP Client |
| Docker | multi-stage | Containerization |

## Fitur

- **Autentikasi JWT** — Login dengan email/password, token persisten di localStorage, auto-refresh token
- **Daftar Produk** — Grid responsif, pagination offset-based, pencarian by nama
- **Tambah Produk** — Form dengan validasi, dropdown kategori dinamis, notifikasi sukses/error
- **Route Protection** — Halaman tambah produk hanya bisa diakses setelah login
- **Responsive Design** — Mobile-first layout

## Prasyarat

- Node.js 20+
- npm 9+
- Docker (opsional, untuk container)

## Cara Menjalankan

### Development

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

### Docker

```bash
# Build & jalankan dengan docker-compose
docker-compose up --build

# Atau manual
docker build -t storemini .
docker run -p 3000:80 storemini
```

Buka [http://localhost:3000](http://localhost:3000)

## Akun Demo

| Field | Value |
|---|---|
| Email | `john@mail.com` |
| Password | `changeme` |

## Struktur Project

```
src/
├── api/              # Modul API (auth, products, categories)
├── components/       # Komponen reusable (Navbar, ProductCard, dll)
├── contexts/         # React Context (AuthContext)
├── lib/              # Utilitas (axios instance)
├── pages/            # Halaman (Login, ProductList, AddProduct)
├── types/            # TypeScript types & Zod schemas
├── router.tsx        # Konfigurasi routing
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # TailwindCSS base styles
```

## API Endpoints

| Aksi | Metode | Endpoint |
|---|---|---|
| Login | POST | `/api/v1/auth/login` |
| Profil | GET | `/api/v1/auth/profile` |
| Refresh Token | POST | `/api/v1/auth/refresh-token` |
| Daftar Produk | GET | `/api/v1/products?offset=0&limit=12` |
| Tambah Produk | POST | `/api/v1/products/` |
| Daftar Kategori | GET | `/api/v1/categories` |

Base URL: `https://api.escuelajs.co`
