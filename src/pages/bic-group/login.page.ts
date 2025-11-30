import { type Page, type Locator } from '@playwright/test';

export class GroupLoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly cookieAcceptBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        // Định nghĩa locator (Cần update ID chính xác sau khi bạn soi Web)
        this.usernameInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
        this.loginBtn = page.locator('ion-button[type="submit"]');
        this.cookieAcceptBtn = page.getByTestId('cd-accept-all-button');
    }

    async navigate() {
        // Lấy URL từ config của project hiện tại
        await this.page.goto('/login');
    }

    async performLogin(user: string, pass: string) {
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.page.waitForTimeout(2000);
        await this.loginBtn.click();
        await this.handleCookieBanner();
    }

    async handleCookieBanner() {
        try {
            console.log('--- 🍪 Checking for Cookie Banner... ---');
            // Chờ tối đa 5000ms (5 giây) xem nút có hiện ra không
            await this.cookieAcceptBtn.waitFor({ state: 'visible', timeout: 5000 });

            // Nếu dòng trên không lỗi (tức là nút có hiện), thì click
            await this.cookieAcceptBtn.click();
            console.log('--- ✅ Đã click tắt Cookie Banner ---');

            // Chờ xíu cho banner lặn mất hẳn để không che nút khác
            await this.cookieAcceptBtn.waitFor({ state: 'hidden' });
        } catch (error) {
            // Nếu chờ 5s mà không thấy -> Nhảy vào đây -> Không làm gì cả
            console.log('--- ⏭️ Không thấy Cookie Banner, bỏ qua. ---');
        }
    }
}