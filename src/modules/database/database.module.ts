import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductPlan,
  Subscription,
  User,
  Coupon,
  PromotionCode,
} from './entities';
import {
  CouponService,
  ProductPlanService,
  PromotionCodeService,
  SubscriptionService,
  UserService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Subscription, ProductPlan, Coupon, PromotionCode],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Subscription,
      ProductPlan,
      Coupon,
      PromotionCode,
    ]),
  ],
  providers: [
    UserService,
    SubscriptionService,
    ProductPlanService,
    CouponService,
    PromotionCodeService,
  ],
  exports: [
    UserService,
    SubscriptionService,
    ProductPlanService,
    CouponService,
    PromotionCodeService,
  ],
})
export class DatabaseModule {}
