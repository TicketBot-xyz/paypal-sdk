import { HttpClient } from '../http-client';
import { Order, PurchaseUnit } from '../types';

export interface CreateOrderParams {
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: PurchaseUnit[];
  payer?: any;
  application_context?: {
    return_url?: string;
    cancel_url?: string;
    brand_name?: string;
    landing_page?: 'LOGIN' | 'GUEST_CHECKOUT' | 'NO_PREFERENCE';
    user_action?: 'CONTINUE' | 'PAY_NOW';
    payment_method?: {
      payer_selected?: string;
      payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
    };
  };
}

export interface UpdateOrderParams {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: any;
  from?: string;
}

export class OrdersResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create an order
   */
  async create(params: CreateOrderParams): Promise<Order> {
    return this.httpClient.post('/v2/checkout/orders', params);
  }

  /**
   * Show order details
   */
  async retrieve(orderId: string): Promise<Order> {
    return this.httpClient.get(`/v2/checkout/orders/${orderId}`);
  }

  /**
   * Update an order
   */
  async update(orderId: string, updates: UpdateOrderParams[]): Promise<void> {
    await this.httpClient.patch(`/v2/checkout/orders/${orderId}`, updates);
  }

  /**
   * Authorize payment for order
   */
  async authorize(orderId: string, params?: {
    payment_source?: any;
    application_context?: any;
  }): Promise<Order> {
    return this.httpClient.post(`/v2/checkout/orders/${orderId}/authorize`, params || {});
  }

  /**
   * Capture payment for order
   */
  async capture(orderId: string, params?: {
    payment_source?: any;
    application_context?: any;
  }): Promise<Order> {
    return this.httpClient.post(`/v2/checkout/orders/${orderId}/capture`, params || {});
  }

  /**
   * Confirm payment for order
   */
  async confirm(orderId: string, params: {
    payment_source: any;
    application_context?: any;
  }): Promise<Order> {
    return this.httpClient.post(`/v2/checkout/orders/${orderId}/confirm-payment-source`, params);
  }
} 