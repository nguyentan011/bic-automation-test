import { Page, BrowserContext } from '@playwright/test';

export class AuthAPI {

    // Hàm này lấy Token trực tiếp từ Cookie của trình duyệt
    async getTokenFromCookies(context: BrowserContext): Promise<string> {
        // Lấy tất cả cookies hiện có
        const cookies = await context.cookies();

        // Tìm cookie có tên là 'BIC_GROUP.WEB.idToken'
        // (Lọc cái nào có value dài nhất để tránh lấy nhầm cái rỗng)
        const tokenCookie = cookies.find(c => c.name === 'BIC_GROUP.WEB.idToken' && c.value.length > 50);

        if (!tokenCookie) {
            // In ra danh sách cookie để debug nếu không tìm thấy
            console.log('🍪 Cookies found:', cookies.map(c => c.name));
            throw new Error("❌ Không tìm thấy Cookie token 'BIC_GROUP.WEB.idToken'!");
        }

        console.log('--- ✅ Đã lấy được Token từ Cookie! ---');
        return tokenCookie.value;
    }
}