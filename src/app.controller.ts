import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import {
  CreateCheckoutSessionRequestDto,
  CreateCheckoutSessionResponseDto,
  CreateCouponRequestDto,
  CreateProductPlanRequestDto,
  CreateProductPlanResponseDto,
  CreatePromotionCodeRequestDto,
  CreateUserAndStripeCustomerRequestDto,
  CreateUserAndStripeCustomerResponseDto,
  GetProductPlansRequestDto,
  GetProductPlansResponseDto,
  GetStripeCheckoutSessionByIdResponseDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  UpdateProductPlanActivationRequestDto,
  UpdateProductPlanActivationResponseDto,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('product-plan')
  @ApiOperation({
    description: 'Create a product plan',
  })
  createProductPlan(
    @Body() createProductRequestDto: CreateProductPlanRequestDto,
  ): Promise<CreateProductPlanResponseDto> {
    return this.appService.createProductPlan(createProductRequestDto);
  }

  @Put('product-plan/:productPlanId/activation')
  @ApiOperation({
    description: 'Update a product plan activation',
  })
  updateProductPlan(
    @Param('productPlanId') productPlanId: string,
    @Body()
    updateProductPlanActivationRequestDto: UpdateProductPlanActivationRequestDto,
  ): Promise<UpdateProductPlanActivationResponseDto> {
    return this.appService.updateProductPlanActivation(
      productPlanId,
      updateProductPlanActivationRequestDto,
    );
  }

  @Get('product-plans')
  @ApiOperation({
    description: 'Get product plans',
  })
  getProductPlans(
    @Query() getProductPlansRequestDto: GetProductPlansRequestDto,
  ): Promise<GetProductPlansResponseDto> {
    return this.appService.getProductPlans(getProductPlansRequestDto);
  }

  @Post('create-user-and-stripe-customer')
  @ApiOperation({
    description: 'Create a user and stripe customer',
  })
  createUser(
    @Body() createUserRequestDto: CreateUserAndStripeCustomerRequestDto,
  ): Promise<CreateUserAndStripeCustomerResponseDto> {
    return this.appService.createUserAndStripeCustomer(createUserRequestDto);
  }

  @Get('users')
  @ApiOperation({
    description: 'Get users',
  })
  getUsers(
    @Query() getUsersRequestDto: GetUsersRequestDto,
  ): Promise<GetUsersResponseDto> {
    return this.appService.getUsers(getUsersRequestDto);
  }

  @Post('create-checkout-session')
  @ApiOperation({
    description: 'Create a checkout session',
  })
  createCheckoutSession(
    @Body() createCheckoutSessionRequestDto: CreateCheckoutSessionRequestDto,
  ): Promise<CreateCheckoutSessionResponseDto> {
    return this.appService.createCheckoutSession(
      createCheckoutSessionRequestDto,
    );
  }

  @Get('stripe-checkout-session/:stripeCheckoutSessionId')
  @ApiOperation({
    description: 'Get a stripe checkout session by id',
  })
  getStripeCheckoutSessionById(
    @Param('stripeCheckoutSessionId') stripeCheckoutSessionId: string,
  ): Promise<GetStripeCheckoutSessionByIdResponseDto> {
    return this.appService.getStripeCheckoutSessionById(
      stripeCheckoutSessionId,
    );
  }

  @Get('stripe/success')
  @ApiOperation({
    description: 'Handle a success checkout session',
  })
  handleSuccessCheckoutSession(
    @Query('session_id') sessionId?: string,
  ): Promise<object> {
    return this.appService.handleSuccessCheckoutSession(sessionId);
  }

  // @Get('stripe/cancel')
  // @ApiOperation({
  //   description: 'Handle a cancel checkout session',
  // })
  // handleCancelCheckoutSession(
  //   @Query('session_id') sessionId?: string,
  // ): Promise<object> {
  //   return this.appService.handleCancelCheckoutSession(sessionId);
  // }

  @Post('stripe/webhook')
  @ApiOperation({
    description: 'Handle a webhook',
  })
  handleWebhook(
    // @Req() req: RawBodyRequest<Request>,
    @Req() req: Request & { rawBody: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const payload = req.rawBody;
      console.log({ signature, payload });

      return this.appService.handleWebhook(payload, signature);
    } catch (error) {
      console.log('Webhook processing failed:', error);
      throw error;
    }
  }

  @Post('cancel-stripe-subscription/:stripeSubscriptionId')
  @ApiOperation({
    description: 'Cancel a stripe subscription',
  })
  cancelStripeSubscription(
    @Param('stripeSubscriptionId') stripeSubscriptionId: string,
  ) {
    return this.appService.cancelStripeSubscription(stripeSubscriptionId);
  }

  @Post('resume-stripe-subscription/:stripeSubscriptionId')
  @ApiOperation({
    description: 'Resume a stripe subscription',
  })
  resumeStripeSubscription(
    @Param('stripeSubscriptionId') stripeSubscriptionId: string,
  ) {
    return this.appService.resumeStripeSubscription(stripeSubscriptionId);
  }

  @Post('create-coupon')
  @ApiOperation({
    description: 'Create a coupon',
  })
  createCoupon(@Body() createCouponRequestDto: CreateCouponRequestDto) {
    return this.appService.createCoupon(createCouponRequestDto);
  }

  @Get('coupons')
  @ApiOperation({
    description: 'Get coupons',
  })
  getCoupons() {
    return this.appService.getCoupons();
  }

  @Post('create-promotion-code')
  @ApiOperation({
    description: 'Create a promotion code',
  })
  createPromotionCode(
    @Body() createPromotionCodeRequestDto: CreatePromotionCodeRequestDto,
  ) {
    return this.appService.createPromotionCode(createPromotionCodeRequestDto);
  }

  @Get('promotion-codes')
  @ApiOperation({
    description: 'Get promotion codes',
  })
  getPromotionCodes() {
    return this.appService.getPromotionCodes();
  }

  @Get('user-sessions/:email')
  @ApiOperation({
    description: 'Get user payments',
  })
  getUserSessions(@Param('email') email: string) {
    return this.appService.getUserSessions(email);
  }
}
