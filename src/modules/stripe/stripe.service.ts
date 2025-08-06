import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new BadRequestException(
        'STRIPE_SECRET_KEY environment variable is required',
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-07-30.basil',
    });
  }

  async createProduct(input: {
    name: string;
    description: string;
    features: string[];
  }): Promise<Stripe.Product> {
    const { name, description, features } = input;

    const product = await this.stripe.products.create({
      name,
      description,
      metadata: {
        features: JSON.stringify(features),
      },
    });

    this.logger.log(`Created Stripe product: ${product.id}`);
    return product;
  }

  async createPrice(
    productId: string,
    input: {
      price: number;
      name: string;
    },
  ): Promise<Stripe.Price> {
    const { price, name } = input;

    const stripePrice = await this.stripe.prices.create({
      product: productId,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        planName: name,
      },
    });

    return stripePrice;
  }

  async createProductAndPrice(config: {
    name: string;
    description: string;
    features: string[];
    price: number;
  }): Promise<{ product: Stripe.Product; price: Stripe.Price }> {
    const product = await this.createProduct(config);
    const price = await this.createPrice(product.id, config);

    return {
      product,
      price,
    };
  }

  async updateProductActivation(input: {
    stripeProductId: string;
    isActive: boolean;
  }): Promise<Stripe.Product> {
    const { stripeProductId, isActive } = input;

    const stripeProduct = await this.stripe.products.update(stripeProductId, {
      active: isActive,
      metadata: {
        isActive: isActive.toString(),
      },
    });

    return stripeProduct;
  }

  async updatePriceActivation(input: {
    stripePriceId: string;
    isActive: boolean;
  }): Promise<Stripe.Price> {
    const { stripePriceId, isActive } = input;

    const stripePrice = await this.stripe.prices.update(stripePriceId, {
      active: isActive,
      metadata: {
        isActive: isActive.toString(),
      },
    });

    return stripePrice;
  }

  async getStripeProductById(input: {
    stripeProductId: string;
  }): Promise<Stripe.Product> {
    const { stripeProductId } = input;

    return await this.stripe.products.retrieve(stripeProductId);
  }

  async getStripePriceById(input: {
    stripePriceId: string;
  }): Promise<Stripe.Price> {
    const { stripePriceId } = input;

    return await this.stripe.prices.retrieve(stripePriceId);
  }

  async createOrGetStripeCustomer(input: {
    email: string;
  }): Promise<Stripe.Customer> {
    const { email } = input;

    const existingStripeCustomer = await this.stripe.customers.search({
      query: `email:'${email}'`,
    });

    if (existingStripeCustomer.data.length > 0) {
      return existingStripeCustomer.data[0];
    }

    return await this.stripe.customers.create({ email });
  }

  async getStripeCustomer(input: {
    stripeCustomerId: string;
  }): Promise<Stripe.Customer> {
    const { stripeCustomerId } = input;

    const customer = await this.stripe.customers.retrieve(stripeCustomerId);

    if (customer.deleted) {
      throw new BadRequestException(
        `Customer ${stripeCustomerId} has been deleted`,
      );
    }

    return customer as Stripe.Customer;
  }

  async createCheckoutSession(input: {
    customerId: string;
    priceId: string;
    trialDays?: number;
    productPlanId: string;
    userId: string;
    stripePromotionCodeId?: string;
  }): Promise<Stripe.Checkout.Session> {
    const {
      customerId,
      priceId,
      trialDays = 14,
      productPlanId,
      userId,
      stripePromotionCodeId,
    } = input;

    const customer = await this.stripe.customers.retrieve(customerId);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: trialDays,
      },
      success_url:
        this.configService.get<string>('ADDRESS_URL') +
        '/stripe/success' +
        '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url:
        this.configService.get<string>('ADDRESS_URL') +
        '/stripe/cancel' +
        '?session_id={CHECKOUT_SESSION_ID}',
      // allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        productPlanId,
        userId,
      },
      discounts: stripePromotionCodeId
        ? [{ promotion_code: stripePromotionCodeId }]
        : [],
    });

    return session;
  }

  async getStripeCheckoutSessionById(input: {
    stripeCheckoutSessionId: string;
  }): Promise<Stripe.Checkout.Session> {
    const { stripeCheckoutSessionId } = input;

    return await this.stripe.checkout.sessions.retrieve(
      stripeCheckoutSessionId,
      {
        expand: ['customer', 'subscription'],
      },
    );
  }

  verifyWebhookSignature(body: Buffer, signature: string): Stripe.Event {
    const STRIPE_WEBHOOK_SECRET = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!STRIPE_WEBHOOK_SECRET) {
      throw new BadRequestException(
        'STRIPE_WEBHOOK_SECRET environment variable is required',
      );
    }

    try {
      return this.stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      this.logger.error('Webhook signature verification failed:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  async getStripeSubscriptionById(input: {
    stripeSubscriptionId: string;
  }): Promise<Stripe.Subscription> {
    const { stripeSubscriptionId } = input;

    return await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
  }

  async cancelStripeSubscription(input: {
    stripeSubscriptionId: string;
  }): Promise<Stripe.Subscription> {
    const { stripeSubscriptionId } = input;

    return await this.stripe.subscriptions.cancel(stripeSubscriptionId);
  }

  async resumeStripeSubscription(input: {
    stripeSubscriptionId: string;
  }): Promise<Stripe.Subscription> {
    const { stripeSubscriptionId } = input;

    return await this.stripe.subscriptions.resume(stripeSubscriptionId);
  }

  async createCoupon(input: {
    percentOff: number;
    duration: 'once' | 'repeating' | 'forever';
    durationInMonths: number;
  }): Promise<Stripe.Coupon> {
    const { percentOff, duration, durationInMonths } = input;

    return await this.stripe.coupons.create({
      percent_off: percentOff,
      duration,
      duration_in_months: durationInMonths,
    });
  }

  async getStripeCouponById(input: {
    stripeCouponId: string;
  }): Promise<Stripe.Coupon> {
    const { stripeCouponId } = input;

    return await this.stripe.coupons.retrieve(stripeCouponId);
  }

  async createPromotionCode(input: {
    code: string;
    maxRedemptions: number;
    expiresAt?: Date;
    stripeCouponId: string;
  }): Promise<Stripe.PromotionCode> {
    const { code, maxRedemptions, expiresAt, stripeCouponId } = input;

    return await this.stripe.promotionCodes.create({
      code,
      max_redemptions: maxRedemptions,
      expires_at: expiresAt ? expiresAt.getTime() / 1000 : null,
      coupon: stripeCouponId,
    });
  }

  async getStripePromotionCodeById(input: {
    stripePromotionCodeId: string;
  }): Promise<Stripe.PromotionCode> {
    const { stripePromotionCodeId } = input;

    return await this.stripe.promotionCodes.retrieve(stripePromotionCodeId);
  }

  async getAllPaymentsByCustomer(input: {
    stripeCustomerId: string;
  }): Promise<Stripe.Charge[]> {
    const { stripeCustomerId } = input;
    const response = await this.stripe.charges.list({
      customer: stripeCustomerId,
      limit: 100,
    });

    return response.data;
  }

  async getUserSessions(input: { stripeCustomerId: string }) {
    const { stripeCustomerId } = input;
    const sessions = await this.stripe.checkout.sessions.list({
      customer: stripeCustomerId,
    });

    return sessions;
  }
}
