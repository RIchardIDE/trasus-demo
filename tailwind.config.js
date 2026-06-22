/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./register.html",
    "./homepage/**.html",
    "./admin/**.html",
    "./src/**.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // mapping
        bg: 'rgb(var(--bg) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',

        'surface-container-highest':
        'rgb(var(--surface-container-highest, 30 30 30) / <alpha-value>)',
        "on-primary": "#233148",
        "inverse-surface": "#e2e2e5",
        "tertiary": "#00dbe9",
        "surface-container-highest": "#333537",
        "surface-container-high": "#282a2c",
        "on-secondary-fixed-variant": "#474646",
        "on-primary-fixed-variant": "#39475f",
        "on-secondary": "#313030",
        "surface-tint": "#b9c7e4",
        "surface-variant": "#333537",
        "on-error-container": "#ffdad6",
        "error": "#ffb4ab",
        "primary": "#b9c7e4",
        "tertiary-fixed": "#7df4ff",
        "primary-container": "#0a192f",
        "on-surface-variant": "#c5c6cd",
        "tertiary-fixed-dim": "#00dbe9",
        "on-secondary-fixed": "#1c1b1b",
        "inverse-primary": "#515f78",
        "surface": "#121416",
        "outline-variant": "#44474d",
        "on-primary-fixed": "#0d1c32",
        "secondary-fixed": "#e5e2e1",
        "surface-container": "#1e2022",
        "on-surface": "#e2e2e5",
        "on-tertiary-fixed-variant": "#004f54",
        "outline": "#8f9097",
        "primary-fixed-dim": "#b9c7e4",
        "on-secondary-container": "#bab8b7",
        "error-container": "#93000a",
        "on-tertiary": "#00363a",
        "surface-bright": "#37393b",
        "background": "#121416",
        "on-background": "#e2e2e5",
        "surface-container-lowest": "#0c0e10",
        "surface-container-low": "#1a1c1e",
        "primary-fixed": "#d6e3ff",
        "on-error": "#690005",
        "tertiary-container": "#001d1f",
        "on-tertiary-fixed": "#002022",
        "inverse-on-surface": "#2f3133",
        "on-tertiary-container": "#009099",
        "surface-dim": "#121416",
        "secondary-fixed-dim": "#c8c6c5",
        "secondary": "#c8c6c5",
        "on-primary-container": "#74829d",
        "secondary-container": "#4a4949"
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "class",
//   content: [
//     // ชี้เป้าให้ Tailwind สแกนหาคลาสให้ครบทุกหน้า
//     "./index.html",
//     "./*.html",
//     "./homepage/**/*.html",
//     "./admin/**/*.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     "./*.js" // สแกนไฟล์ JS หน้าแรกที่มีคลาส Tailwind เช่น explorer.js
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // --- สีดั้งเดิมและตัวแปรหลัก ---
//         bg: 'rgb(var(--bg) / <alpha-value>)',
//         text: 'rgb(var(--text) / <alpha-value>)',
//         "surface": "var(--color-surface)",
//         "on-surface": "var(--color-on-surface)",
//         "background": "var(--color-background)",
//         "primary": "var(--color-primary)",
//         "word": "var(--color-word)",

//         // --- สี Material Design 3 (รวบรวมจากทุกหน้า) ---
//         "on-primary-fixed-variant": "#39475f",
//         "tertiary-fixed-dim": "#00dbe9",
//         "on-primary-container": "#74829d",
//         "tertiary": "#00dbe9",
//         "inverse-on-surface": "#2f3133",
//         "inverse-surface": "#e2e2e5",
//         "on-background": "#e2e2e5",
//         "on-secondary-fixed-variant": "#474646",
//         "surface-container-high": "#282a2c",
//         "surface-container": "#1e2022",
//         "tertiary-container": "#001d1f",
//         "secondary-fixed": "#e5e2e1",
//         "on-tertiary-fixed-variant": "#004f54",
//         "inverse-primary": "#515f78",
//         "secondary-fixed-dim": "#c8c6c5",
//         "on-secondary-container": "#bab8b7",
//         "surface-bright": "#37393b",
//         "primary-container": "#0a192f",
//         "surface-container-highest": "#333537",
//         "on-tertiary": "#00363a",
//         "on-primary-fixed": "#0d1c32",
//         "tertiary-fixed": "#7df4ff",
//         "secondary": "#c8c6c5",
//         "surface-tint": "#b9c7e4",
//         "surface-container-lowest": "#0c0e10",
//         "surface-dim": "#121416",
//         "on-primary": "#233148",
//         "outline-variant": "#44474d",
//         "on-tertiary-fixed": "#002022",
//         "surface-container-low": "#1a1c1e",
//         "on-tertiary-container": "#009099",
//         "outline": "#8f9097",
//         "on-error": "#690005",
//         "on-surface-variant": "#c5c6cd",
//         "secondary-container": "#4a4949",
//         "on-secondary-fixed": "#1c1b1b",
//         "on-error-container": "#ffdad6",
//         "surface-variant": "#333537",
//         "primary-fixed": "#d6e3ff",
//         "on-secondary": "#313030",
//         "primary-fixed-dim": "#b9c7e4",
//         "error": "#ffb4ab",
//         "error-container": "#93000a"
//       },
//       borderRadius: {
//         "DEFAULT": "0.125rem",
//         "lg": "0.25rem",
//         "xl": "0.5rem",
//         "full": "0.75rem"
//       },
//       fontFamily: {
//         // 🛠️ ชื่อฟอนต์ตัว P พิมพ์ใหญ่ ถูกต้องตาม Google Fonts 100%
//         "headline": ["Chakra Petch", "serif"],
//         "body": ["Chakra Petch", "sans-serif"],
//         "label": ["Inter", "sans-serif"]
//       }
//     }
//   },
//   plugins: [
//     // 🔌 เรียกใช้ปลั๊กอิน (ต้องติดตั้ง npm install @tailwindcss/forms @tailwindcss/container-queries ไว้แล้ว)
//     require('@tailwindcss/forms'),
//     require('@tailwindcss/container-queries')
//   ]
// };