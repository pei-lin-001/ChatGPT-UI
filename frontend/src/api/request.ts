// API 请求工具
import { MessagePlugin } from 'tdesign-vue-next';

const API_BASE_URL = import.meta.env.VITE_API_URL_PREFIX || '/0x';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

class RequestApi {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(url: string, method: string = 'GET', data?: any): Promise<Response> {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, options);
      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('user_token') || sessionStorage.getItem('user_token');
    if (token) {
      return {
        'Authorization': `Token ${token}`,
      };
    }
    return {};
  }
}

// 创建默认实例
const requestApi = new RequestApi();

// 导出默认函数
export default function RequestApiFunction(url: string, method: string = 'GET', data?: any): Promise<Response> {
  return requestApi.request(url, method, data);
}

// 也导出类实例，以便其他地方使用
export { RequestApi, requestApi };