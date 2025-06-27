import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { PayPalConfig } from './types';
import { PayPalAPIError, PayPalConnectionError } from './errors';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  nonce: string;
}

export class HttpClient {
  private client: AxiosInstance;
  private config: PayPalConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private static defaultConfig: Partial<PayPalConfig> = {};

  constructor(config: PayPalConfig) {
    this.config = { ...HttpClient.defaultConfig, ...config };
    
    const baseURL = this.config.environment === 'live' 
      ? 'https://api.paypal.com' 
      : 'https://api.sandbox.paypal.com';

    this.client = axios.create({
      baseURL,
      timeout: this.config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  static setDefaultConfig(config: Partial<PayPalConfig>): void {
    HttpClient.defaultConfig = { ...HttpClient.defaultConfig, ...config };
  }

  private setupInterceptors(): void {
    // Request interceptor - ensure auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Skip auth for token requests
        if (!config.url?.includes('/oauth2/token')) {
          await this.ensureValidToken();
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retried) {
          originalRequest._retried = true;
          try {
            await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
            return this.client.request(originalRequest);
          } catch (refreshError) {
            return Promise.reject(this.handleError(refreshError));
          }
        }

        if (this.shouldRetry(error) && !originalRequest._retried) {
          originalRequest._retried = true;
          const retryDelay = this.getRetryDelay(originalRequest._retryCount || 0);
          await this.delay(retryDelay);
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          return this.client.request(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry - 30000) { // 30s buffer
      await this.refreshToken();
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const response = await this.client.post<TokenResponse>(
        '/v1/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: this.config.clientId,
            password: this.config.clientSecret,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    } catch (error) {
      throw new PayPalConnectionError('Failed to authenticate with PayPal', error);
    }
  }

  private shouldRetry(error: any): boolean {
    if (!error.response) return true;
    const status = error.response.status;
    return status >= 500 || status === 429;
  }

  private getRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount), 10000);
  } 

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: any): Error {
    if (error.response?.data) {
      const paypalError = error.response.data;
      return new PayPalAPIError(
        paypalError.message || 'PayPal API Error',
        error.response.status,
        paypalError.name || 'UNKNOWN_ERROR',
        paypalError.debug_id,
        paypalError.details || []
      );
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      return new PayPalConnectionError('Network error occurred', error);
    }

    return error;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
} 