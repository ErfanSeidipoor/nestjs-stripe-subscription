# NestJS Stripe Subscription

Author: [Erfan Seidipoor](https://github.com/ErfanSeidipoor)

A sample project demonstrating how to connect NestJS with Stripe for products with subscription plans. The project features modular design, PostgreSQL integration, and a full set of APIs for user, plan, coupon, and promotion code management.

---

## API Endpoints

| Method | Endpoint                                            | Description                          |
| ------ | --------------------------------------------------- | ------------------------------------ |
| GET    | `/`                                                 | Health check                         |
| POST   | `/product-plan`                                     | Create a product plan                |
| PUT    | `/product-plan/:productPlanId/activation`           | Update a product plan activation     |
| GET    | `/product-plans`                                    | Get product plans                    |
| POST   | `/create-user-and-stripe-customer`                  | Create a user and Stripe customer    |
| GET    | `/users`                                            | Get users                            |
| POST   | `/create-checkout-session`                          | Create a Stripe checkout session     |
| GET    | `/stripe-checkout-session/:stripeCheckoutSessionId` | Get a Stripe checkout session by ID  |
| GET    | `/stripe/success`                                   | Handle a successful checkout session |
| POST   | `/stripe/webhook`                                   | Handle Stripe webhook events         |
| POST   | `/cancel-stripe-subscription/:stripeSubscriptionId` | Cancel a Stripe subscription         |
| POST   | `/resume-stripe-subscription/:stripeSubscriptionId` | Resume a Stripe subscription         |
| POST   | `/create-coupon`                                    | Create a coupon                      |
| GET    | `/coupons`                                          | Get all coupons                      |
| POST   | `/create-promotion-code`                            | Create a promotion code              |
| GET    | `/promotion-codes`                                  | Get all promotion codes              |
| GET    | `/user-sessions/:email`                             | Get user payments by email           |

---

## Project Modules

### 1. `modules/database`

- **Purpose:**  
  Manages all data persistence using PostgreSQL and TypeORM.
- **Entities:**
  - `User`: Application users, linked to Stripe customers
  - `ProductPlan`: Subscription plans, linked to Stripe products/prices
  - `Subscription`: User subscriptions, linked to Stripe subscriptions
  - `Coupon`: Discount coupons, linked to Stripe coupons
  - `PromotionCode`: Promotion codes, linked to Stripe promotion codes
- **Services:**
  - `UserService`, `ProductPlanService`, `SubscriptionService`, `CouponService`, `PromotionCodeService`  
    Provide CRUD and business logic for each entity.

### 2. `modules/stripe`

- **Purpose:**  
  Handles all Stripe-related logic, including product/plan creation, checkout session management, customer management, subscription lifecycle, coupon and promotion code management, and webhook processing.
- **Key Service:**
  - `StripeService`: Encapsulates all Stripe API interactions, such as creating products, prices, customers, sessions, coupons, and handling webhooks.

---

## Quick Start

1. Clone, install, and configure environment variables.
2. Run with:
   ```bash
   pnpm run start:dev
   ```
