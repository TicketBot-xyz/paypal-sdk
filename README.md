# TicketBot PayPal SDK

A modern, Stripe-inspired PayPal SDK for Node.js with full TypeScript support.

## Why This SDK?

PayPal's official SDKs are incomplete and don't support many of their own APIs. This SDK provides:

- ✅ **Complete API Coverage** - All PayPal REST APIs including subscriptions, billing, webhooks
- ✅ **Stripe-like Developer Experience** - Clean, intuitive API design
- ✅ **Full TypeScript Support** - Comprehensive type definitions
- ✅ **Automatic Token Management** - No manual OAuth handling
- ✅ **Built-in Retry Logic** - Handles network errors and rate limiting
- ✅ **Webhook Verification** - Secure webhook handling

## Installation

```bash
npm install @ticketbot/paypal-sdk
```

## Quick Start

```typescript
import { PayPal } from '@ticketbot/paypal-sdk';

const paypal = PayPal.create({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  environment: 'sandbox', // or 'live'
  webhookId: 'your_webhook_id'
});

// Create a subscription
const subscription = await paypal.subscriptions.create({
  plan_id: 'your_plan_id',
  start_time: new Date().toISOString(),
  application_context: {
    return_url: 'https://yoursite.com/success',
    cancel_url: 'https://yoursite.com/cancel',
    user_action: 'SUBSCRIBE_NOW'
  }
});

// Cancel a subscription
await paypal.subscriptions.cancel('subscription_id', 'User requested cancellation');

// Verify webhooks
const isValid = await paypal.webhooks.verifySignature(headers, body, webhookId);
```

## API Reference

### Subscriptions

```typescript
// Create subscription
const subscription = await paypal.subscriptions.create(params);

// Get subscription
const subscription = await paypal.subscriptions.retrieve('sub_id');

// Update subscription (plan changes)
const updated = await paypal.subscriptions.update('sub_id', updateParams);

// Cancel subscription
await paypal.subscriptions.cancel('sub_id', 'reason');

// List subscriptions
const subscriptions = await paypal.subscriptions.list({
  plan_id: 'plan_id',
  page_size: 10
});
```

### Plans

```typescript
// Create plan
const plan = await paypal.plans.create({
  name: 'Basic Plan',
  billing_cycles: [/* billing cycles */]
});

// Get plan
const plan = await paypal.plans.retrieve('plan_id');

// List plans
const plans = await paypal.plans.list();
```

### Orders (One-time payments)

```typescript
// Create order
const order = await paypal.orders.create({
  intent: 'CAPTURE',
  purchase_units: [/* purchase units */]
});

// Capture order
const capture = await paypal.orders.capture('order_id');
```

### Webhooks

```typescript
// Verify webhook signature
const isValid = await paypal.webhooks.verifySignature(
  headers,
  rawBody,
  webhookId
);

// Parse webhook event
const event = paypal.webhooks.constructEvent(body, headers, webhookId);
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
import { PayPalAPIError, PayPalConnectionError } from '@ticketbot/paypal-sdk';

try {
  const subscription = await paypal.subscriptions.create(params);
} catch (error) {
  if (error instanceof PayPalAPIError) {
    console.log('API Error:', error.code, error.message);
    console.log('Debug ID:', error.debugId);
    console.log('Details:', error.details);
  } else if (error instanceof PayPalConnectionError) {
    console.log('Connection Error:', error.message);
  }
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { Subscription, Plan, CreateSubscriptionParams } from '@ticketbot/paypal-sdk';

const params: CreateSubscriptionParams = {
  plan_id: 'plan_123',
  start_time: new Date().toISOString(),
  // Full autocomplete and type checking
};
```

## Migration from Legacy SDKs

### From `paypal-rest-sdk`

```typescript
// Old way
const paypal = require('paypal-rest-sdk');
paypal.configure({ ... });
paypal.billingPlan.create(planData, callback);

// New way
const paypal = PayPal.create({ ... });
const plan = await paypal.plans.create(planData);
```

### From Custom SDK

```typescript
// Old way
const client = new PaypalHttpClient(env);
const request = new CreateSubscriptionRequest(data);
const response = await client.execute(request);

// New way
const paypal = PayPal.create({ ... });
const subscription = await paypal.subscriptions.create(data);
```

## Advanced Configuration

```typescript
// Set default config 
PayPal.setDefaultConfig({
  timeout: 60000,
  maxRetries: 3
});

// Create client with custom config
const paypal = PayPal.create({
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  timeout: 30000,
  maxRetries: 2
});
```

## License 

MIT - See [LICENSE](LICENSE) file for details.