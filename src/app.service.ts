import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCheckoutSessionRequestDto,
  CreateCheckoutSessionResponseDto,
  CreateCouponRequestDto,
  CreateProductPlanRequestDto,
  CreateProductPlanResponseDto,
  CreatePromotionCodeRequestDto,
  CreateUserAndStripeCustomerRequestDto,
  CreateUserAndStripeCustomerResponseDto,
  GetCouponsItemResponseDto,
  GetCouponsResponseDto,
  GetProductPlansItemResponseDto,
  GetProductPlansRequestDto,
  GetProductPlansResponseDto,
  GetPromotionCodesItemResponseDto,
  GetPromotionCodesResponseDto,
  GetStripeCheckoutSessionByIdResponseDto,
  GetUsersItemResponseDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  UpdateProductPlanActivationRequestDto,
  UpdateProductPlanActivationResponseDto,
} from './dto';
import { StripeService } from './modules/stripe';
import {
  ProductPlanService,
  SubscriptionService,
  UserService,
  CouponService,
  PromotionCodeService,
  PromotionCode,
} from './modules/database';
import Stripe from 'stripe';

@Injectable()
export class AppService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly productPlanService: ProductPlanService,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly couponService: CouponService,
    private readonly promotionCodeService: PromotionCodeService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createProductPlan(
    createProductPlanRequestDto: CreateProductPlanRequestDto,
  ): Promise<CreateProductPlanResponseDto> {
    const { name, description, features, price } = createProductPlanRequestDto;

    const { product: stripeProduct, price: stripePrice } =
      await this.stripeService.createProductAndPrice({
        name,
        description,
        features,
        price,
      });

    const productPlan = await this.productPlanService.create({
      name,
      description,
      features,
      price,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });

    return Promise.resolve({
      productPlan,
      stripeProduct,
      stripePrice,
    });
  }

  async updateProductPlanActivation(
    productPlanId: string,
    updateProductPlanActivationRequestDto: UpdateProductPlanActivationRequestDto,
  ): Promise<UpdateProductPlanActivationResponseDto> {
    const { isActive } = updateProductPlanActivationRequestDto;

    const productPlan = await this.productPlanService.updateActivation(
      productPlanId,
      isActive,
    );

    const stripeProduct = await this.stripeService.updateProductActivation({
      stripeProductId: productPlan.stripeProductId,
      isActive,
    });

    const stripePrice = await this.stripeService.updatePriceActivation({
      stripePriceId: productPlan.stripePriceId,
      isActive,
    });

    return {
      productPlan,
      stripeProduct,
      stripePrice,
    };
  }

  async getProductPlans(
    getProductPlansRequestDto: GetProductPlansRequestDto,
  ): Promise<GetProductPlansResponseDto> {
    const { search, productPlanIds } = getProductPlansRequestDto;

    const productPlans = await this.productPlanService.getAll({
      search,
      productPlanIds,
    });

    const items: GetProductPlansItemResponseDto[] = [];

    for (const productPlan of productPlans) {
      const stripeProduct = await this.stripeService.getStripeProductById({
        stripeProductId: productPlan.stripeProductId,
      });

      const stripePrice = await this.stripeService.getStripePriceById({
        stripePriceId: productPlan.stripePriceId,
      });

      items.push({
        productPlan,
        stripeProduct,
        stripePrice,
      });
    }
    return { items };
  }

  async createUserAndStripeCustomer(
    createUserAndStripeCustomerRequestDto: CreateUserAndStripeCustomerRequestDto,
  ): Promise<CreateUserAndStripeCustomerResponseDto> {
    const { email } = createUserAndStripeCustomerRequestDto;

    let user = await this.userService.createOrGetUser(email);

    const stripeCustomer = await this.stripeService.createOrGetStripeCustomer({
      email,
    });

    user = await this.userService.updateStripeCustomerId({
      userId: user.id,
      stripeCustomerId: stripeCustomer.id,
    });

    return { user, stripeCustomer };
  }

  async getUsers(
    getUsersRequestDto: GetUsersRequestDto,
  ): Promise<GetUsersResponseDto> {
    const { email } = getUsersRequestDto;

    const users = await this.userService.getAll({
      email,
    });

    const items: GetUsersItemResponseDto[] = [];

    for (const user of users) {
      const stripeCustomer = await this.stripeService.getStripeCustomer({
        stripeCustomerId: user.stripeCustomerId,
      });

      items.push({
        user,
        stripeCustomer,
      });
    }
    return { items };
  }

  async createCheckoutSession(
    createCheckoutSessionRequestDto: CreateCheckoutSessionRequestDto,
  ): Promise<CreateCheckoutSessionResponseDto> {
    const {
      email,
      productPlanId,
      trialDays = 14,
      code,
    } = createCheckoutSessionRequestDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let promotionCode: PromotionCode;
    if (code) {
      promotionCode = await this.promotionCodeService.getByCode(code);
      if (!promotionCode) {
        throw new NotFoundException('Promotion code not found');
      }

      console.log({ user, promotionCode });

      if (promotionCode.userId && promotionCode.userId !== user.id) {
        throw new BadRequestException(
          'Promotion code is not valid for this user',
        );
      }
    }

    const productPlan = await this.productPlanService.getById(productPlanId);
    if (!productPlan) {
      throw new NotFoundException('Product plan not found');
    }

    const customer = await this.stripeService.createOrGetStripeCustomer({
      email,
    });

    const stripeCheckoutSession =
      await this.stripeService.createCheckoutSession({
        customerId: customer.id,
        priceId: productPlan.stripePriceId,
        trialDays,
        productPlanId,
        userId: user.id,
        stripePromotionCodeId: promotionCode?.stripePromotionCodeId,
      });

    return {
      stripeCheckoutSession,
    };
  }

  async getStripeCheckoutSessionById(
    stripeCheckoutSessionId: string,
  ): Promise<GetStripeCheckoutSessionByIdResponseDto> {
    const stripeCheckoutSession =
      await this.stripeService.getStripeCheckoutSessionById({
        stripeCheckoutSessionId,
      });

    if (!stripeCheckoutSession) {
      throw new NotFoundException('Stripe checkout session not found');
    }

    console.log({ stripeCheckoutSession });

    return {
      stripeCheckoutSession,
    };
  }

  async handleSuccessCheckoutSession(sessionId: string): Promise<object> {
    const checkoutSession =
      await this.stripeService.getStripeCheckoutSessionById({
        stripeCheckoutSessionId: sessionId,
      });

    if (!checkoutSession) {
      throw new NotFoundException('Stripe checkout session not found');
    }

    if (
      checkoutSession.status === 'open' ||
      checkoutSession.status === 'expired'
    ) {
      return {
        message: 'Stripe checkout session is not complete',
        sessionId,
      };
    }

    const { productPlanId, userId } = checkoutSession.metadata;

    const productPlan = await this.productPlanService.getById(productPlanId);
    if (!productPlan) {
      throw new NotFoundException('Product plan not found');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (checkoutSession.status === 'complete') {
    }

    return {
      message: 'Stripe checkout session is complete',
      sessionId,
      productPlan,
      checkoutSession,
    };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const event = this.stripeService.verifyWebhookSignature(payload, signature);

    console.log(`Processing webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handleWebhookInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;
        case 'customer.subscription.updated':
          await this.handleWebhookSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'customer.subscription.deleted':
          await this.handleWebhookSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'invoice.payment_failed':
          await this.handleWebhookInvoicePaymentFailed(
            event.data.object as Stripe.Invoice,
          );
          break;

        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing webhook event ${event.type}:`, error);
      throw error;
    }
  }

  async handleWebhookInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    const email = invoice.customer_email;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stripeSubscriptionId =
      invoice.lines.data[0].parent.subscription_item_details.subscription;

    const stripeSubscription =
      await this.stripeService.getStripeSubscriptionById({
        stripeSubscriptionId,
      });

    const stripePriceId = stripeSubscription.items.data[0].plan.id;

    const stripePrice = await this.stripeService.getStripePriceById({
      stripePriceId,
    });

    const stripeProductId = stripePrice.product as string;

    const productPlan =
      await this.productPlanService.getByStripeProductId(stripeProductId);

    if (!productPlan) {
      throw new NotFoundException('Product plan not found');
    }

    console.dir(stripePrice, { depth: null });
    console.dir(productPlan, { depth: null });

    let subscription =
      await this.subscriptionService.getByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!subscription) {
      const endsAt =
        stripeSubscription.ended_at || stripeSubscription.trial_end;

      subscription = await this.subscriptionService.create({
        userId: user.id,
        productPlanId: productPlan.id,
        stripeSubscriptionId,
        stripeSubscriptionStatus: stripeSubscription.status,
        startsAt: new Date(stripeSubscription.start_date * 1000),
        endsAt: endsAt ? new Date(endsAt * 1000) : undefined,
      });
    }
  }

  async handleWebhookInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const email = invoice.customer_email;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stripeSubscriptionId =
      invoice.lines.data[0].parent.subscription_item_details.subscription;

    const stripeSubscription =
      await this.stripeService.getStripeSubscriptionById({
        stripeSubscriptionId,
      });

    if (!stripeSubscription) {
      throw new NotFoundException('Stripe subscription not found');
    }

    let subscription =
      await this.subscriptionService.getByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription =
      await this.subscriptionService.updateStripeSubscriptionStatus(
        subscription.id,
        stripeSubscription.status,
      );
  }

  async handleWebhookSubscriptionUpdated(
    stripeSubscription: Stripe.Subscription,
  ): Promise<void> {
    const { id: stripeSubscriptionId } = stripeSubscription;

    let subscription =
      await this.subscriptionService.getByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription =
      await this.subscriptionService.updateStripeSubscriptionStatus(
        subscription.id,
        stripeSubscription.status,
      );
  }

  async handleWebhookSubscriptionDeleted(
    stripeSubscription: Stripe.Subscription,
  ): Promise<void> {
    const { id: stripeSubscriptionId } = stripeSubscription;

    let subscription =
      await this.subscriptionService.getByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription =
      await this.subscriptionService.updateStripeSubscriptionStatus(
        subscription.id,
        'canceled',
      );
  }

  async cancelStripeSubscription(stripeSubscriptionId: string) {
    const stripeSubscription =
      await this.stripeService.cancelStripeSubscription({
        stripeSubscriptionId,
      });

    return { stripeSubscription };
  }

  async resumeStripeSubscription(stripeSubscriptionId: string) {
    const stripeSubscription =
      await this.stripeService.resumeStripeSubscription({
        stripeSubscriptionId,
      });

    return { stripeSubscription };
  }

  async createCoupon(createCouponRequestDto: CreateCouponRequestDto) {
    const { name, percentOff, duration, durationInMonths } =
      createCouponRequestDto;

    const stripeCoupon = await this.stripeService.createCoupon({
      percentOff,
      duration,
      durationInMonths,
    });

    const coupon = await this.couponService.create({
      name,
      percentOff,
      duration,
      durationInMonths,
      stripeCouponId: stripeCoupon.id,
    });

    return { coupon, stripeCoupon };
  }

  async getCoupons(): Promise<GetCouponsResponseDto> {
    const coupons = await this.couponService.getAll();

    const items: GetCouponsItemResponseDto[] = [];

    for (const coupon of coupons) {
      const stripeCoupon = await this.stripeService.getStripeCouponById({
        stripeCouponId: coupon.stripeCouponId,
      });

      items.push({
        coupon,
        stripeCoupon,
      });
    }
    return { items };
  }

  async createPromotionCode(
    createPromotionCodeRequestDto: CreatePromotionCodeRequestDto,
  ) {
    const { code, maxRedemptions, expiresAt, couponId, userEmail } =
      createPromotionCodeRequestDto;

    const coupon = await this.couponService.getById(couponId);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    const promotionCode = await this.promotionCodeService.create({
      code,
      maxRedemptions,
      expiresAt,
      couponId,
      userEmail,
    });

    const stripePromotionCode = await this.stripeService.createPromotionCode({
      code,
      maxRedemptions,
      expiresAt,
      stripeCouponId: coupon.stripeCouponId,
    });

    try {
      await this.promotionCodeService.updateStripePromotionCodeId({
        promotionCodeId: promotionCode.id,
        stripePromotionCodeId: stripePromotionCode.id,
      });
    } catch (error) {
      await this.promotionCodeService.delete({
        promotionCodeId: promotionCode.id,
      });

      throw new Error(error.message);
    }

    return { promotionCode, stripePromotionCode };
  }

  async getPromotionCodes(): Promise<GetPromotionCodesResponseDto> {
    const promotionCodes = await this.promotionCodeService.getAll();

    const items: GetPromotionCodesItemResponseDto[] = [];

    for (const promotionCode of promotionCodes) {
      const stripePromotionCode =
        await this.stripeService.getStripePromotionCodeById({
          stripePromotionCodeId: promotionCode.stripePromotionCodeId,
        });

      const coupon = await this.couponService.getById(promotionCode.couponId);

      items.push({
        promotionCode,
        stripePromotionCode,
        coupon,
      });
    }

    return { items };
  }

  async getUserSessions(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payments = await this.stripeService.getUserSessions({
      stripeCustomerId: user.stripeCustomerId,
    });

    return { payments };
  }
}
