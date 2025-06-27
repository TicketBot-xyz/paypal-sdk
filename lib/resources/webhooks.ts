import { HttpClient } from '../http-client';
import { WebhookEvent, WebhookVerificationRequest, WebhookVerificationResponse } from '../types';

export class WebhooksResource {
  constructor(private httpClient: HttpClient) {}

  /**
   * Verify webhook signature
   */
  async verifySignature(
    headers: Record<string, string>,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    const verificationRequest: WebhookVerificationRequest = {
      auth_algo: headers['paypal-auth-algo'] || headers['PAYPAL-AUTH-ALGO'] || '',
      cert_url: headers['paypal-cert-url'] || headers['PAYPAL-CERT-URL'] || '',
      transmission_id: headers['paypal-transmission-id'] || headers['PAYPAL-TRANSMISSION-ID'] || '',
      transmission_sig: headers['paypal-transmission-sig'] || headers['PAYPAL-TRANSMISSION-SIG'] || '',
      transmission_time: headers['paypal-transmission-time'] || headers['PAYPAL-TRANSMISSION-TIME'] || '',
      webhook_id: webhookId,
      webhook_event: JSON.parse(body)
    };

    try {
      const response: WebhookVerificationResponse = await this.httpClient.post(
        '/v1/notifications/verify-webhook-signature',
        verificationRequest
      );
      return response.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return false;
    }
  }

  /**
   * Construct webhook event from raw body (with signature verification)
   */
  async constructEvent(body: string, headers: Record<string, string>, webhookId: string): Promise<WebhookEvent | null> {
    try {
      // First verify the webhook signature
      const isValid = await this.verifySignature(headers, body, webhookId);
      if (!isValid) {
        console.error('Webhook signature verification failed');
        return null;
      }

      const event: WebhookEvent = JSON.parse(body);
      return event;
    } catch (error) {
      console.error('Failed to construct webhook event:', error);
      return null;
    }
  }

  /**
   * List webhook events
   */
  async listEvents(params?: {
    page_size?: number;
    start_time?: string;
    end_time?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.start_time) queryParams.append('start_time', params.start_time);
    if (params?.end_time) queryParams.append('end_time', params.end_time);

    const queryString = queryParams.toString();
    const url = queryString ? `/v1/notifications/webhooks-events?${queryString}` : '/v1/notifications/webhooks-events';
    
    return this.httpClient.get(url);
  }

  /**
   * Resend webhook event
   */
  async resendEvent(eventId: string, webhookIds: string[]): Promise<any> {
    return this.httpClient.post(`/v1/notifications/webhooks-events/${eventId}/resend`, {
      webhook_ids: webhookIds
    });
  }
} 