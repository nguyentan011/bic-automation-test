import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Logic đọc file môi trường
const envName = process.env.ENV || 'stg';
const envPath = path.resolve(__dirname, 'config', `.env.${envName}`);
dotenv.config({ path: envPath });

console.log(`🚀 Đang chạy trên môi trường: ${envName.toUpperCase()}`);

export default defineConfig({
  // QUAN TRỌNG: Trỏ về thư mục chứa test
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  // 2. CẤU HÌNH BROWSER CHUNG
  use: {
    // Để null để trình duyệt tự bung full màn hình
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'] // Lệnh mở full màn hình
    },

    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

    baseURL: process.env.BASE_URL_GROUP,
  },

  // 3. CẤU HÌNH PROJECT (Sửa lỗi tại đây)
  projects: [
    {
      name: 'group-desktop',
      // 👇 SỬA ĐỔI QUAN TRỌNG:
      // Dùng '**/*.spec.ts' để tìm TẤT CẢ các file test trong folder tests.
      // Không lọc theo folder bic-group nữa để tránh lỗi đường dẫn.
      testMatch: '**/*.spec.ts',

      use: {
        ...devices['Desktop Chrome'],
        viewport: null,             // Bung full màn hình
        deviceScaleFactor: undefined, // Tắt tỉ lệ màn hình mặc định đi
        baseURL: process.env.BASE_URL_GROUP
      },
    },
  ],
});