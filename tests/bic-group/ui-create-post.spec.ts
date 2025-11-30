import { test, expect } from '@src/fixtures/group-test';

test.describe('Chức năng Đăng bài (Newsfeed)', () => {

    // 1. SETUP: Đăng nhập trước mỗi bài test
    test.beforeEach(async ({ groupLoginPage }) => {
        const username = process.env.TEST_USERNAME || '';
        const password = process.env.TEST_PASSWORD || '';

        console.log('--- 🟢 SETUP: Đang đăng nhập... ---');
        await groupLoginPage.navigate();
        await groupLoginPage.performLogin(username, password);
    });

    test('User đăng bài text + ảnh vào nhóm thành công', { tag: '@smoke' }, async ({ feedPage }) => {
        // --- A. ARRANGE ---
        const timestamp = Date.now();
        const postContent = `Automation Test Post ${timestamp} - Chào ngày mới!`;

        const targetGroups = [0, 1];

        // Khuyến khích: copy file ảnh vào project, ví dụ:
        // tests/fixtures/images/post-demo.jpg
        const imagePath = 'src/fixtures/images/anh.jpg';

        // --- B. ACT ---
        console.log('--- 🟡 STEP 1: Chọn nơi đăng bài ---');
        await feedPage.selectTargetAudience(targetGroups);

        console.log('--- 🟡 STEP 2: Nhập nội dung + upload ảnh + Đăng ---');
        await feedPage.inputContentAndPost(postContent, imagePath);

        // --- C. ASSERT ---
        console.log('--- 🔵 STEP 3: Verify bài viết đã hiện lên ---');
        await expect(feedPage.firstPostContent).toContainText(postContent);

        console.log('✅ Test Passed!');
    });
});
