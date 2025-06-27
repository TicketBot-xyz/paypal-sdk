import { HttpClient } from '../http-client';
import { 
  Subscription, 
  CreateSubscriptionParams, 
  UpdateSubscriptionParams,
  ListSubscriptionsParams,
  PayPalListResponse 
} from '../types';

export class SubscriptionsResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create a subscription
   */
  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    return this.httpClient.post('/v1/billing/subscriptions', params);
  }

  /**
   * Retrieve a subscription
   */
  async retrieve(subscriptionId: string): Promise<Subscription> {
    return this.httpClient.get(`/v1/billing/subscriptions/${subscriptionId}`);
  }

  /**
   * Update a subscription
   */
  async update(subscriptionId: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    return this.httpClient.post(`/v1/billing/subscriptions/${subscriptionId}/revise`, params);
  }

  /**
   * List subscriptions
   */
  async list(params?: ListSubscriptionsParams): Promise<PayPalListResponse<Subscription>> {
    const queryParams = new URLSearchParams();
    
    if (params?.plan_id) queryParams.append('plan_id', params.plan_id);
    if (params?.start_time) queryParams.append('start_time', params.start_time);
    if (params?.end_time) queryParams.append('end_time', params.end_time);
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/v1/billing/subscriptions?${queryString}` : '/v1/billing/subscriptions';
    
    return this.httpClient.get(url);
  }

  /**
   * Cancel a subscription
   */
  async cancel(subscriptionId: string, reason?: string): Promise<void> {
    await this.httpClient.post(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      reason: reason || 'User requested cancellation'
    });
  }

  /**
   * Suspend a subscription
   */
  async suspend(subscriptionId: string, reason: string): Promise<void> {
    await this.httpClient.post(`/v1/billing/subscriptions/${subscriptionId}/suspend`, {
      reason
    });
  }

  /**
   * Activate a subscription
   */
  async activate(subscriptionId: string, reason: string): Promise<void> {
    await this.httpClient.post(`/v1/billing/subscriptions/${subscriptionId}/activate`, {
      reason
    });
  }

  /**
   * Capture payment for subscription (for failed payments)
   */
  async capturePayment(subscriptionId: string, note?: string, amount?: { currency_code: string; value: string }): Promise<any> {
    const body: any = {};
    if (note) body.note = note;
    if (amount) body.amount = amount;
    
    return this.httpClient.post(`/v1/billing/subscriptions/${subscriptionId}/capture`, body);
  }

  /**
   * Get subscription transactions
   */
  async getTransactions(subscriptionId: string, startTime: string, endTime: string): Promise<any> {
    const queryParams = new URLSearchParams({
      start_time: startTime,
      end_time: endTime
    });
    
    return this.httpClient.get(`/v1/billing/subscriptions/${subscriptionId}/transactions?${queryParams}`);
  }
} 