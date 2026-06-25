import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        explorer: 'homepage/explorer.html',
        workspace: 'homepage/workspace.html',
        games: 'homepage/games.html',
      }
    }
  }
});