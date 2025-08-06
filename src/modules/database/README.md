# Database Module

Manages PostgreSQL entities and services for users, product plans, coupons, promotion codes, and subscriptions.

## Entities

- **User**: Represents application users. Each user can be linked to a Stripe customer and can have multiple subscriptions.
- **ProductPlan**: Represents subscription plans available for purchase. Each plan is linked to a Stripe product/price.
- **Subscription**: Represents a user's subscription to a product plan. Linked to a Stripe subscription and tracks status, trial, and end dates.
- **Coupon**: Represents discount coupons that can be applied to subscriptions. Linked to Stripe coupons.
- **PromotionCode**: Represents promotion codes that can be used for discounts. Linked to Stripe promotion codes.

## Services

- **UserService**: Handles creation, retrieval, updating, and deletion of users. Also manages linking users to Stripe customers.
- **ProductPlanService**: Manages CRUD operations for product plans, including activation and deactivation.
- **SubscriptionService**: Handles subscription lifecycle, including creation, status updates, cancellation, and retrieval.
- **CouponService**: Manages creation and retrieval of coupon entities.
- **PromotionCodeService**: Handles creation and retrieval of promotion code entities.
