// 1. CHÚ Ý: Import 'test' từ fixture của Group (Không phải từ @playwright/test)
import { test, expect } from '@src/fixtures/group-test';

// SỬA DÒNG 4: Thêm chữ page vào trong ngoặc nhọn
test('User đăng nhập thành công', async ({ groupLoginPage, page }) => {
  // --- A. ARRANGE (Chuẩn bị) ---
  // Lấy tài khoản từ file .env
  const username = process.env.TEST_USERNAME || '';
  const password = process.env.TEST_PASSWORD || '';

  // --- B. ACT (Hành động) ---
  console.log('1. Đang truy cập trang login...');
  await groupLoginPage.navigate();

  console.log('2. Đang thực hiện đăng nhập...');
  await groupLoginPage.performLogin(username, password);

  // --- C. ASSERT (Kiểm tra) ---
  console.log('3. Đang kiểm tra kết quả...');

  // Kiểm tra URL đã thay đổi (Ví dụ: không còn chữ 'login' nữa)
  await expect(page).not.toHaveURL(/.*login/);

  // (Tùy chọn) Kiểm tra tiêu đề trang hoặc 1 element nào đó xuất hiện sau khi login
  // await expect(page).toHaveTitle(/Home/);
});