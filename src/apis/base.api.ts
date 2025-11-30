import { APIRequestContext } from '@playwright/test';

export class BaseAPI {
    constructor(protected request: APIRequestContext) { }

    /**
     * Hàm hỗ trợ tạo Headers chuẩn
     * Tự động thêm Content-Type và Token (nếu có)
     */
    private _getHeaders(token?: string) {
        const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (token) {
            console.log(`🔍 DEBUG HEADER: Đang gửi Token với độ dài ${token.length} ký tự.`);
            console.log(`🔍 DEBUG HEADER: 10 ký tự đầu: ${token.substring(0, 10)}...`);

            // Gắn Bearer Token vào
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('⚠️ CẢNH BÁO: Đang gửi request KHÔNG CÓ Token!');
        }

        return headers;
    }

    // --- PHƯƠNG THỨC POST ---
    protected async post(endpoint: string, body: any, token?: string) {
        const headers = this._getHeaders(token);

        return this.request.post(endpoint, {
            data: body,
            headers: headers,
        });
    }

    // --- PHƯƠNG THỨC GET ---
    protected async get(endpoint: string, token?: string) {
        const headers = this._getHeaders(token);

        return this.request.get(endpoint, {
            headers: headers,
        });
    }

    // --- PHƯƠNG THỨC PUT (Nếu cần dùng sau này) ---
    protected async put(endpoint: string, body: any, token?: string) {
        const headers = this._getHeaders(token);

        return this.request.put(endpoint, {
            data: body,
            headers: headers,
        });
    }
}