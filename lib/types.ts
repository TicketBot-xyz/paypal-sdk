export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'live';
  webhookId?: string;
  timeout?: number;
  maxRetries?: number;
}

// Base interfaces
export interface PayPalObject {
  id: string;
  object: string;
  created?: string;
  updated?: string;
}

export interface PayPalListResponse<T> {
  object: 'list';
  data: T[];
  has_more: boolean;
  total_count?: number;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}

// Subscription types
export interface Subscription extends PayPalObject {
  object: 'subscription';
  plan_id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_update_time: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: Money;
  subscriber?: Subscriber;
  billing_info?: BillingInfo;
  create_time: string;
  update_time: string;
  links: Link[];
  plan_overridden?: boolean;
}

export interface CreateSubscriptionParams {
  plan_id: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: Money;
  subscriber?: Subscriber;
  application_context?: ApplicationContext;
  plan?: PlanOverride;
}

export interface UpdateSubscriptionParams {
  plan_id?: string;
  shipping_amount?: Money;
  application_context?: ApplicationContext;
}

export interface ListSubscriptionsParams {
  plan_id?: string;
  start_time?: string;
  end_time?: string;
  page_size?: number;
  page?: number;
}

// Plan types
export interface Plan extends PayPalObject {
  object: 'plan';
  name: string;
  description?: string;
  status: 'CREATED' | 'INACTIVE' | 'ACTIVE';
  billing_cycles: BillingCycle[];
  payment_preferences?: PaymentPreferences;
  taxes?: Taxes;
  quantity_supported?: boolean;
  create_time: string;
  update_time: string;
  links: Link[];
}

export interface CreatePlanParams {
  name: string;
  description?: string;
  billing_cycles: BillingCycle[];
  payment_preferences?: PaymentPreferences;
  taxes?: Taxes;
  quantity_supported?: boolean;
}

// Supporting types
export interface Money {
  currency_code: string;
  value: string;
}

export interface Subscriber {
  name?: Name;
  email_address?: string;
  payer_id?: string;
  shipping_address?: ShippingAddress;
  payment_source?: PaymentSource;
}

export interface Name {
  given_name?: string;
  surname?: string;
}

export interface ShippingAddress {
  name?: Name;
  address?: Address;
}

export interface Address {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string; // city
  admin_area_1?: string; // state
  postal_code?: string;
  country_code: string;
}

export interface ApplicationContext {
  brand_name?: string;
  locale?: string;
  shipping_preference?: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  user_action?: 'SUBSCRIBE_NOW' | 'CONTINUE';
  payment_method?: PaymentMethod;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentMethod {
  payer_selected?: string;
  payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
}

export interface PlanOverride {
  billing_cycles?: BillingCycle[];
  payment_preferences?: PaymentPreferences;
  taxes?: Taxes;
}

export interface BillingCycle {
  frequency: Frequency;
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  total_cycles?: number;
  pricing_scheme?: PricingScheme;
}

export interface Frequency {
  interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  interval_count?: number;
}

export interface PricingScheme {
  fixed_price?: Money;
  create_time?: string;
  update_time?: string;
}

export interface PaymentPreferences {
  auto_bill_outstanding?: boolean;
  setup_fee?: Money;
  setup_fee_failure_action?: 'CONTINUE' | 'CANCEL';
  payment_failure_threshold?: number;
}

export interface Taxes {
  percentage: string;
  inclusive?: boolean;
}

export interface BillingInfo {
  outstanding_balance?: Money;
  cycle_executions?: CycleExecution[];
  last_payment?: LastPayment;
  next_billing_time?: string;
  final_payment_time?: string;
  failed_payments_count?: number;
}

export interface CycleExecution {
  tenure_type: string;
  sequence: number;
  cycles_completed: number;
  cycles_remaining?: number;
  total_cycles?: number;
}

export interface LastPayment {
  amount?: Money;
  time?: string;
}

export interface PaymentSource {
  card?: Card;
  paypal?: PayPalPaymentSource;
}

export interface Card {
  name?: string;
  number?: string;
  security_code?: string;
  expiry?: string;
  billing_address?: Address;
}

export interface PayPalPaymentSource {
  vault_id?: string;
  email_address?: string;
  name?: Name;
  phone?: Phone;
  birth_date?: string;
  tax_info?: TaxInfo;
  address?: Address;
}

export interface Phone {
  phone_type?: 'FAX' | 'HOME' | 'MOBILE' | 'OTHER' | 'PAGER';
  phone_number?: PhoneNumber;
}

export interface PhoneNumber {
  national_number: string;
}

export interface TaxInfo {
  tax_id: string;
  tax_id_type: 'BR_CPF' | 'BR_CNPJ';
}

// Order types
export interface Order extends PayPalObject {
  object: 'order';
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  intent: 'CAPTURE' | 'AUTHORIZE';
  purchase_units: PurchaseUnit[];
  payer?: Payer;
  create_time: string;
  update_time: string;
  links: Link[];
}

export interface PurchaseUnit {
  reference_id?: string;
  amount: Amount;
  payee?: Payee;
  payment_instruction?: PaymentInstruction;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  items?: Item[];
  shipping?: ShippingInfo;
  payments?: Payments;
}

export interface Amount {
  currency_code: string;
  value: string;
  breakdown?: AmountBreakdown;
}

export interface AmountBreakdown {
  item_total?: Money;
  shipping?: Money;
  handling?: Money;
  tax_total?: Money;
  insurance?: Money;
  shipping_discount?: Money;
  discount?: Money;
}

export interface Payee {
  email_address?: string;
  merchant_id?: string;
}

export interface PaymentInstruction {
  platform_fees?: PlatformFee[];
  disbursement_mode?: 'INSTANT' | 'DELAYED';
}

export interface PlatformFee {
  amount: Money;
  payee?: Payee;
}

export interface Item {
  name: string;
  unit_amount: Money;
  tax?: Money;
  quantity: string;
  description?: string;
  sku?: string;
  category?: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS' | 'DONATION';
}

export interface ShippingInfo {
  method?: string;
  name?: Name;
  address?: Address;
}

export interface Payments {
  authorizations?: Authorization[];
  captures?: Capture[];
  refunds?: Refund[];
}

export interface Authorization {
  status: string;
  id: string;
  amount: Money;
  invoice_id?: string;
  custom_id?: string;
  network_transaction_id?: string;
  seller_protection?: SellerProtection;
  expiration_time: string;
  links: Link[];
  create_time: string;
  update_time: string;
}

export interface Capture {
  status: string;
  id: string;
  amount: Money;
  invoice_id?: string;
  custom_id?: string;
  network_transaction_id?: string;
  seller_protection?: SellerProtection;
  final_capture?: boolean;
  seller_receivable_breakdown?: SellerReceivableBreakdown;
  disbursement_mode?: string;
  links: Link[];
  create_time: string;
  update_time: string;
}

export interface Refund {
  status: string;
  id: string;
  amount: Money;
  invoice_id?: string;
  custom_id?: string;
  acquirer_reference_number?: string;
  seller_payable_breakdown?: SellerPayableBreakdown;
  links: Link[];
  create_time: string;
  update_time: string;
}

export interface SellerProtection {
  status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  dispute_categories?: string[];
}

export interface SellerReceivableBreakdown {
  gross_amount: Money;
  paypal_fee: Money;
  paypal_fee_in_receivable_currency?: Money;
  net_amount: Money;
  receivable_amount?: Money;
  exchange_rate?: ExchangeRate;
}

export interface SellerPayableBreakdown {
  gross_amount: Money;
  paypal_fee: Money;
  paypal_fee_in_receivable_currency?: Money;
  net_amount: Money;
  total_refunded_amount?: Money;
}

export interface ExchangeRate {
  source_currency: string;
  target_currency: string;
  value: string;
}

export interface Payer {
  name?: Name;
  email_address?: string;
  payer_id?: string;
  address?: Address;
  phone?: Phone;
  birth_date?: string;
  tax_info?: TaxInfo;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version: string;
  event_type: string;
  summary: string;
  resource: any;
  links: Link[];
}

export interface WebhookVerificationRequest {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: WebhookEvent;
}

export interface WebhookVerificationResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}

// Error types
export interface PayPalError {
  name: string;
  message: string;
  debug_id: string;
  details?: PayPalErrorDetail[];
  links?: Link[];
}

export interface PayPalErrorDetail {
  field?: string;
  value?: string;
  location?: string;
  issue: string;
  description: string;
} 