# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

Berikut adalah **panduan lengkap penggunaan `Row` dan `Col` di Ant Design (antd)** versi terbaru (v5):

---

## ✅ Tujuan Komponen `Row` dan `Col`

Digunakan untuk membuat layout **grid system** berbasis **12 kolom** (default), mirip seperti Bootstrap.

---

## 🔹 Struktur Dasar

```tsx
import { Row, Col } from "antd";

<Row>
  <Col span={12}>Kolom 1 (50%)</Col>
  <Col span={12}>Kolom 2 (50%)</Col>
</Row>;
```

---

## 🔸 Properti Utama `Col`

| Properti                            | Tipe          | Deskripsi                                                              |
| ----------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `span`                              | number        | Jumlah kolom dari 24 bagian (default). Misal: `span={6}` berarti 6/24. |
| `offset`                            | number        | Memberi jarak kosong ke kiri sebanyak x kolom.                         |
| `push`                              | number        | Geser kolom ke kanan                                                   |
| `pull`                              | number        | Geser kolom ke kiri                                                    |
| `xs`, `sm`, `md`, `lg`, `xl`, `xxl` | object/number | Responsive breakpoint (lihat detail di bawah)                          |

---

## 🔸 Properti `Row`

| Properti  | Tipe                       | Deskripsi                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------- |
| `gutter`  | number / \[number, number] | Jarak antar kolom (horizontal dan vertical). Misal: `gutter={[16, 24]}` |
| `justify` | string                     | Posisi horizontal: `start`, `end`, `center`, `space-between`, dll.      |
| `align`   | string                     | Posisi vertikal: `top`, `middle`, `bottom`                              |
| `wrap`    | boolean                    | Apakah kolom boleh pindah baris jika overflow                           |

---

## 🧩 Contoh Responsive Layout

```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
    Konten 1
  </Col>
  <Col xs={24} sm={12} md={8} lg={6} xl={4}>
    Konten 2
  </Col>
</Row>
```

### 🔎 Penjelasan:

- `xs={24}` → penuh di layar kecil (mobile)
- `sm={12}` → 2 kolom di tablet kecil
- `md={8}` → 3 kolom di tablet besar
- `lg={6}` → 4 kolom di laptop
- `xl={4}` → 6 kolom di desktop besar

---

## 🔸 Offset Contoh (Jarak Kosong)

```tsx
<Row>
  <Col span={8} offset={8}>
    Tengah (8 kolom di tengah, offset kiri 8)
  </Col>
</Row>
```

---

## 📦 Tambahan: Layout Preset

Ant Design juga menyediakan:

- `Row gutter={16}` → jarak horizontal 16px
- `Row justify="center"` → konten tengah
- `Row align="middle"` → vertikal tengah

---

## 💡 Tips

- Total kolom per `Row` harus maksimal **24**.
- Pakai `gutter` agar ada spasi antar `Col`.
- Responsive pakai kombinasi `xs`, `sm`, `md`, dll.
- `wrap={false}` jika tidak ingin kolom turun ke baris baru.

---
