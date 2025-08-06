import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';
import { PromotionCode } from '../entities/promotion-code.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class PromotionCodeService {
  constructor(
    @InjectRepository(PromotionCode)
    private readonly promotionCodeRepository: Repository<PromotionCode>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(input: {
    code: string;
    maxRedemptions: number;
    expiresAt: Date;
    couponId: string;
    userEmail: string;
  }): Promise<PromotionCode> {
    const { code, maxRedemptions, expiresAt, couponId, userEmail } = input;

    const couponEntity = await this.couponRepository.findOne({
      where: { id: couponId },
    });

    if (!couponEntity) {
      throw new BadRequestException('Coupon not found');
    }

    let userEntity = null;
    if (userEmail) {
      userEntity = await this.userRepository.findOne({
        where: { email: userEmail },
      });

      if (!userEntity) {
        throw new BadRequestException('User not found');
      }
    }

    const duplicatePromotionCode = await this.promotionCodeRepository.findOne({
      where: { code },
    });

    if (duplicatePromotionCode) {
      throw new BadRequestException('Promotion code already exists');
    }

    const promotionCodeEntity = this.promotionCodeRepository.create({
      code,
      maxRedemptions,
      expiresAt,
      couponId,
      userId: userEntity?.id,
    });

    return this.promotionCodeRepository.save(promotionCodeEntity);
  }

  async getAll(): Promise<PromotionCode[]> {
    return this.promotionCodeRepository.find();
  }

  async updateStripePromotionCodeId(input: {
    promotionCodeId: string;
    stripePromotionCodeId: string;
  }): Promise<PromotionCode> {
    const { promotionCodeId, stripePromotionCodeId } = input;

    const promotionCodeEntity = await this.promotionCodeRepository.findOne({
      where: { id: promotionCodeId },
    });

    if (!promotionCodeEntity) {
      throw new Error('Promotion code not found');
    }

    promotionCodeEntity.stripePromotionCodeId = stripePromotionCodeId;
    return this.promotionCodeRepository.save(promotionCodeEntity);
  }

  async getByStripePromotionCodeId(input: {
    stripePromotionCodeId: string;
  }): Promise<PromotionCode> {
    const { stripePromotionCodeId } = input;

    return this.promotionCodeRepository.findOne({
      where: { stripePromotionCodeId },
    });
  }

  async delete(input: { promotionCodeId: string }): Promise<void> {
    const { promotionCodeId } = input;

    await this.promotionCodeRepository.delete(promotionCodeId);
  }

  async getByCode(code: string): Promise<PromotionCode> {
    return this.promotionCodeRepository.findOne({
      where: { code },
    });
  }
}
