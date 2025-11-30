import { type Page, type Locator, expect } from '@playwright/test';

export class FeedPage {
    readonly page: Page;

    // --- 1. KHAI BÁO LOCATOR ---
    readonly createPostBtn: Locator;      // Nút "Tạo tin nhanh"
    readonly audienceList: Locator;       // Danh sách Group/Community hiện ra
    readonly continueBtn: Locator;        // Nút "Tiếp tục"
    readonly postEditor: Locator;         // Ô nhập nội dung
    readonly postBtn: Locator;            // Nút "Đăng"
    readonly firstPostContent: Locator;   // Bài viết mới nhất (để verify)
    readonly imageInput: Locator;         // Input upload ảnh

    constructor(page: Page) {
        this.page = page;

        // Nút mở popup tạo post
        this.createPostBtn = page.getByTestId('quick_post');

        // Danh sách Group/Community
        this.audienceList = page.getByTestId('audience-item');

        // Nút "Tiếp tục"
        this.continueBtn = page.locator('ion-button').filter({ hasText: 'Tiếp tục' });

        // Editor & nút "Đăng"
        this.postEditor = page.getByTestId('editor.post_editor');

        // 🔹 Dùng role button -> trúng <button> thật bên trong ion-button
        this.postBtn = page.getByRole('button', { name: 'Đăng', exact: true });

        // Bài post mới nhất (trên feed) – để verify
        this.firstPostContent = page
            .locator('div[class*="_postItem"] div[style*="word-break"]')
            .first();

        // Input upload ảnh
        this.imageInput = page.getByTestId('upload_input.image');
    }

    // --- 2. CÁC HÀNH ĐỘNG (ACTIONS) ---

    async navigate() {
        await this.page.goto('/');
    }

    /**
     * Bước 1 & 2: Mở popup và Chọn nơi đăng (Group/Community)
     */
    async selectTargetAudience(targets: (string | number)[]) {
        await this.createPostBtn.click();
        await expect(this.audienceList.first()).toBeVisible();

        for (const target of targets) {
            if (typeof target === 'number') {
                await this.audienceList.nth(target).click();
            } else {
                await this.audienceList.filter({ hasText: target }).click();
            }
        }

        await this.continueBtn.click();
    }

    /**
     * Upload 1 hoặc nhiều ảnh cho post
     * @param files Đường dẫn file (hoặc mảng) từ root project
     *   VD: 'tests/fixtures/images/post-demo.jpg'
     */
    async uploadImages(files: string | string[]) {
        const list = Array.isArray(files) ? files : [files];

        // Gắn file vào input -> trigger upload
        await this.imageInput.setInputFiles(list);

        // 🕒 Đợi thêm cho ảnh upload xong (thực dụng nhưng hiệu quả)
        // Bạn có thể tăng lên 5000–7000ms nếu ảnh nặng / mạng chậm
        await this.page.waitForTimeout(3000);
    }

    /**
     * Bước 3: Nhập nội dung, (tuỳ chọn) upload ảnh và Đăng
     * -> Ảnh sẽ được upload XONG rồi mới bấm Đăng
     */
    async inputContentAndPost(content: string, images?: string | string[]) {
        // Chờ Editor xuất hiện
        await expect(this.postEditor).toBeVisible();

        await this.postEditor.click();
        await this.postEditor.fill(content);

        // Nếu có truyền ảnh thì upload trước khi bấm Đăng
        if (images) {
            await this.uploadImages(images);
        }

        // Chờ nút Đăng sẵn sàng rồi mới click
        await expect(this.postBtn).toBeVisible({ timeout: 15_000 });
        await expect(this.postBtn).toBeEnabled({ timeout: 15_000 });

        // Click trực tiếp vào <button> thật
        await this.postBtn.click();

        // Chờ editor (popup) đóng lại => coi như đăng thành công
        await expect(this.postEditor).toBeHidden({ timeout: 15_000 });
    }
}
