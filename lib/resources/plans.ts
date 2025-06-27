import { HttpClient } from '../http-client';
import { Plan, CreatePlanParams, PayPalListResponse } from '../types';

export class PlansResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Create a billing plan
   */
  async create(params: CreatePlanParams): Promise<Plan> {
    return this.httpClient.post('/v1/billing/plans', params);
  }

  /**
   * Retrieve a billing plan
   */
  async retrieve(planId: string): Promise<Plan> {
    return this.httpClient.get(`/v1/billing/plans/${planId}`);
  }

  /**
   * List billing plans
   */
  async list(params?: { 
    page_size?: number; 
    page?: number; 
    total_required?: boolean 
  }): Promise<PayPalListResponse<Plan>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.total_required) queryParams.append('total_required', params.total_required.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/v1/billing/plans?${queryString}` : '/v1/billing/plans';
    
    return this.httpClient.get(url);
  }

  /**
   * Update a billing plan
   */
  async update(planId: string, updates: Array<{
    op: 'replace';
    path: string;
    value: any;
  }>): Promise<void> {
    await this.httpClient.patch(`/v1/billing/plans/${planId}`, updates);
  }

  /**
   * Activate a billing plan
   */
  async activate(planId: string): Promise<void> {
    await this.httpClient.post(`/v1/billing/plans/${planId}/activate`);
  }

  /**
   * Deactivate a billing plan
   */
  async deactivate(planId: string): Promise<void> {
    await this.httpClient.post(`/v1/billing/plans/${planId}/deactivate`);
  }

  /**
   * Update pricing for a billing plan
   */
  async updatePricing(planId: string, pricingSchemes: Array<{
    billing_cycle_sequence: number;
    pricing_scheme: {
      fixed_price: {
        currency_code: string;
        value: string;
      };
    };
  }>): Promise<void> {
    await this.httpClient.post(`/v1/billing/plans/${planId}/update-pricing-schemes`, {
      pricing_schemes: pricingSchemes
    });
  }
} 