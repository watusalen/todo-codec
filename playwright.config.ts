import { defineConfig, devices } from '@playwright/test';

// Configuração do Playwright para TypeScript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  use: {
    baseURL: 'https://todo-codec.vercel.app',
    
    // Captura de vídeo sempre (vai para test-results automaticamente)
    video: 'on',
    
    // Screenshots sempre
    screenshot: 'on',
    
    // Trace completo sempre
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
