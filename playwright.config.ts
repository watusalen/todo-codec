import { defineConfig, devices } from '@playwright/test';

// Configuração do Playwright para TypeScript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: 'https://todo-codec.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
