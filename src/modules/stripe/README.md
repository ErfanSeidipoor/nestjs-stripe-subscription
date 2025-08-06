# Stripe Module

Handles Stripe checkout, customer, and webhook logic

## Main Methods in StripeService

- **createProduct**: Creates a new Stripe product with name, description, and features.
- **createPrice**: Creates a recurring price for a product in Stripe.
- **createProductAndPrice**: Convenience method to create both a product and its price.
- **updateProductActivation**: Activates or deactivates a Stripe product.
- **updatePriceActivation**: Activates or deactivates a Stripe price.
- **getStripeProductById / getStripePriceById**: Retrieves a product or price from Stripe by ID.
- **createOrGetStripeCustomer**: Finds or creates a Stripe customer by email.
- **getStripeCustomer**: Retrieves a Stripe customer by ID.
- **createCheckoutSession**: Creates a Stripe checkout session for a subscription, with support for trial and promotion codes.
- **getStripeCheckoutSessionById**: Retrieves a checkout session by ID, including expanded customer and subscription data.
- **verifyWebhookSignature**: Verifies the signature of incoming Stripe webhook events.
- **getStripeSubscriptionById**: Retrieves a Stripe subscription by ID.
- **cancelStripeSubscription / resumeStripeSubscription**: Cancels or resumes a Stripe subscription.
- **createCoupon**: Creates a discount coupon in Stripe.
- **getStripeCouponById**: Retrieves a coupon by ID.
- **createPromotionCode**: Creates a promotion code for a coupon in Stripe.
- **getStripePromotionCodeById**: Retrieves a promotion code by ID.
- **getAllPaymentsByCustomer**: Lists all payments (charges) for a Stripe customer.
- **getUserSessions**: Lists all checkout sessions for a Stripe customer.

These methods encapsulate all Stripe API interactions for product, price, customer, subscription, coupon, promotion code, and payment management, as well as webhook verification.
