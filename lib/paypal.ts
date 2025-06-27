import { HttpClient } from './http-client';
import { SubscriptionsResource } from './resources/subscriptions';
import { PlansResource } from './resources/plans';
import { OrdersResource } from './resources/orders';
import { WebhooksResource } from './resources/webhooks';
import { PaymentsResource } from './resources/payments';
import { PayPalConfig } from './types';

export class PayPal {
  private httpClient: HttpClient;
  
  public subscriptions: SubscriptionsResource;
  public plans: PlansResource;
  public orders: OrdersResource;
  public webhooks: WebhooksResource;
  public payments: PaymentsResource;

  constructor(config: PayPalConfig) {
    this.httpClient = new HttpClient(config);
    
    this.subscriptions = new SubscriptionsResource(this.httpClient);
    this.plans = new PlansResource(this.httpClient);
    this.orders = new OrdersResource(this.httpClient);
    this.webhooks = new WebhooksResource(this.httpClient);
    this.payments = new PaymentsResource(this.httpClient);
  }

  static create(config: PayPalConfig): PayPal {
    return new PayPal(config);
  }

  static setDefaultConfig(config: Partial<PayPalConfig>): void {
    HttpClient.setDefaultConfig(config);
  }
} 