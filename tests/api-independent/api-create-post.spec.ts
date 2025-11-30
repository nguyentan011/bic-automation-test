import { test, expect } from '@src/fixtures/group-test';

test('API: Tạo và Publish bài viết (Dùng Manual Token)', { tag: '@api' }, async ({ contentApi }) => {

    // --- 1. LẤY NGUYÊN LIỆU TỪ ENV ---
    const token = process.env.MANUAL_TOKEN;
    const groupId = process.env.TARGET_GROUP_ID;

    // Kiểm tra an toàn: Nếu quên điền env thì báo lỗi ngay để biết đường sửa
    if (!token) {
        throw new Error("❌ LỖI: Chưa có biến 'MANUAL_TOKEN' trong file .env (Hãy copy từ Cookie)");
    }
    if (!groupId) {
        throw new Error("❌ LỖI: Chưa có biến 'TARGET_GROUP_ID' trong file .env");
    }

    // Tạo nội dung ngẫu nhiên để tránh trùng lặp
    const postContent = `API Manual Test ${Date.now()} - Hello World`;

    console.log('---------------------------------------------');
    console.log(`🔑 Dùng Token: ${token.substring(0, 15)}...`);
    console.log(`🎯 Đăng vào Group: ${groupId}`);
    console.log(`📝 Nội dung: ${postContent}`);
    console.log('---------------------------------------------');

    // --- 2. GỌI API: TẠO BẢN NHÁP (Draft) ---
    console.log('--- 🟡 Bước 1: Gọi API Create Draft ---');
    const postId = await contentApi.createPostDraft(token, postContent, [groupId]);

    console.log(`=> ✅ Tạo thành công Draft ID: ${postId}`);
    expect(postId).toBeTruthy();

    // --- 3. GỌI API: PUBLISH (Xuất bản) ---
    console.log('--- 🟡 Bước 2: Gọi API Publish ---');
    const publishRes = await contentApi.publishPost(token, postId, postContent, [groupId]);

    // --- 4. VERIFY KẾT QUẢ ---
    console.log('--- 🟢 Bước 3: Verify Kết quả ---');

    // Kiểm tra trạng thái bài viết phải là PUBLISHED
    expect(publishRes.data.status).toBe('PUBLISHED');

    // Kiểm tra nội dung trả về phải khớp với nội dung gửi đi
    expect(publishRes.data.content).toBe(postContent);

    console.log('🎉 Test Passed: Bài viết đã được đăng thành công!');
});