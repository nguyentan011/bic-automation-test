import { test as base } from '@playwright/test';
import { GroupLoginPage } from '../pages/bic-group/login.page';
import { FeedPage } from '../pages/bic-group/feed.page';
import { AuthAPI } from '../apis/auth.api';
// 👇 1. Import mới
import { ContentAPI } from '../apis/content.api';

// 2. Khai báo kiểu dữ liệu
type GroupFixtures = {
    groupLoginPage: GroupLoginPage;
    feedPage: FeedPage;
    authApi: AuthAPI;
    contentApi: ContentAPI; // 👈 Thêm dòng này
};

export const test = base.extend<GroupFixtures>({
    groupLoginPage: async ({ page }, use) => {
        await use(new GroupLoginPage(page));
    },
    feedPage: async ({ page }, use) => {
        await use(new FeedPage(page));
    },

    // 👇 1. SỬA AUTH API: Bỏ chữ 'request', bỏ tham số trong ngoặc new AuthAPI()
    // Vì AuthAPI mới chỉ là helper class đơn thuần
    authApi: async ({ }, use) => {
        await use(new AuthAPI());
    },

    // 👇 2. CONTENT API: Giữ nguyên 'request' vì nó cần gửi API
    contentApi: async ({ request }, use) => {
        await use(new ContentAPI(request));
    },
});

export { expect } from '@playwright/test';