import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        explorer: 'homepage/explorer.html',
        workspace: 'homepage/workspace.html',
        register: 'homepage/register.html',
        // 💡 ถ้ากัปตันมีไฟล์ HTML อยู่ในโฟลเดอร์อื่น ให้ชี้พาธแบบนี้ครับ
        // homepage: 'homepage/homepage.html',
        // admin: 'admin/admin.html'
      }
    }
  }
});