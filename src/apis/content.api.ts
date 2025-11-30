import { BaseAPI } from './base.api';

export class ContentAPI extends BaseAPI {

    /**
     * Bước 1: Tạo bài viết nháp (Draft)
     * URL: /v1/content/posts/
     */
    async createPostDraft(token: string, content: string, groupIds: string[]) {
        const url = `${process.env.BASE_URL_API}/v1/content/posts/`;

        const payload = {
            audience: {
                groupIds: groupIds,
            },
            content: content,
            isEnabledDonation: true,
            mentions: [],
            hashtags: [],
            media: []
        };

        const response = await this.post(url, payload, token);

        if (!response.ok()) {
            const errorText = await response.text();
            throw new Error(`Create Draft API failed: ${response.status()} - ${errorText}`);
        }

        const resBody = await response.json();
        // Trả về ID của bài viết để dùng cho bước Publish
        return resBody.data.id;
    }

    /**
     * Bước 2: Xuất bản bài viết (Publish)
     * URL: /v1/content/posts/{id}/publish
     */
    async publishPost(token: string, postId: string, content: string, groupIds: string[]) {
        const url = `${process.env.BASE_URL_API}/v1/content/posts/${postId}/publish`;

        const payload = {
            // ... (giữ nguyên payload cũ)
            audience: { groupIds: groupIds, userIds: [] },
            content: content,
            linkPreview: { domain: "", url: "" },
            media: { images: [], videos: [], files: [] },
            mentions: {},
            series: [],
            tags: []
        };

        // 👇 SỬA DÒNG NÀY: Đổi this.post thành this.put
        const response = await this.put(url, payload, token);

        if (!response.ok()) {
            const errorText = await response.text();
            throw new Error(`Publish API failed: ${response.status()} - ${errorText}`);
        }

        const resBody = await response.json();
        return resBody;
    }
}