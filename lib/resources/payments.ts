import { HttpClient } from '../http-client';
import { Authorization, Capture, Refund } from '../types';

export interface RefundCaptureParams {
  amount?: {
    currency_code: string;
    value: string;
  };
  invoice_id?: string;
  note_to_payer?: string;
}

export interface ReauthorizeParams {
  amount: {
    currency_code: string;
    value: string;
  };
}

export class PaymentsResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Show captured payment details
   */
  async getCapture(captureId: string): Promise<Capture> {
    return this.httpClient.get(`/v2/payments/captures/${captureId}`);
  }

  /**
   * Refund captured payment
   */
  async refundCapture(captureId: string, params?: RefundCaptureParams): Promise<Refund> {
    return this.httpClient.post(`/v2/payments/captures/${captureId}/refund`, params || {});
  }

  /**
   * Show refund details
   */
  async getRefund(refundId: string): Promise<Refund> {
    return this.httpClient.get(`/v2/payments/refunds/${refundId}`);
  }

  /**
   * Show authorization details
   */
  async getAuthorization(authorizationId: string): Promise<Authorization> {
    return this.httpClient.get(`/v2/payments/authorizations/${authorizationId}`);
  }

  /**
   * Capture authorized payment
   */
  async captureAuthorization(
    authorizationId: string, 
    params?: {
      amount?: { currency_code: string; value: string };
      invoice_id?: string;
      note_to_payer?: string;
      soft_descriptor?: string;
      final_capture?: boolean;
    }
  ): Promise<Capture> {
    return this.httpClient.post(`/v2/payments/authorizations/${authorizationId}/capture`, params || {});
  }

  /**
   * Reauthorize authorized payment
   */
  async reauthorize(authorizationId: string, params: ReauthorizeParams): Promise<Authorization> {
    return this.httpClient.post(`/v2/payments/authorizations/${authorizationId}/reauthorize`, params);
  }

  /**
   * Void authorized payment
   */
  async voidAuthorization(authorizationId: string): Promise<void> {
    await this.httpClient.post(`/v2/payments/authorizations/${authorizationId}/void`);
  }
} 