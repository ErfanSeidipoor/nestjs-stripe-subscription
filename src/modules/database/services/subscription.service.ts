import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(subscription: {
    userId: string;
    productPlanId: string;
    stripeSubscriptionId: string;
    stripeSubscriptionStatus:
      | 'active'
      | 'canceled'
      | 'incomplete'
      | 'incomplete_expired'
      | 'past_due'
      | 'paused'
      | 'trialing'
      | 'unpaid';
    startsAt?: Date;
    endsAt?: Date;
  }): Promise<Subscription> {
    const newSubscription = this.subscriptionRepository.create(subscription);
    await this.subscriptionRepository.save(newSubscription);
    return await this.updateStripeSubscriptionStatus(
      newSubscription.id,
      subscription.stripeSubscriptionStatus,
    );
  }

  async updateStripeSubscriptionStatus(
    subscriptionId: string,
    stripeSubscriptionStatus:
      | 'active'
      | 'canceled'
      | 'incomplete'
      | 'incomplete_expired'
      | 'past_due'
      | 'paused'
      | 'trialing'
      | 'unpaid',
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (
      stripeSubscriptionStatus === 'active' ||
      stripeSubscriptionStatus === 'trialing'
    ) {
      subscription.isActive = true;
    } else {
      subscription.isActive = false;
    }

    subscription.stripeSubscriptionStatus = stripeSubscriptionStatus;
    await this.subscriptionRepository.save(subscription);

    return subscription;
  }

  async getById(subscriptionId: string): Promise<Subscription> {
    return this.subscriptionRepository.findOne({
      where: {
        id: subscriptionId,
      },
    });
  }

  async getByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription> {
    return this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId },
    });
  }
}
