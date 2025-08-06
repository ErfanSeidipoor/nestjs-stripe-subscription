import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(input: {
    name: string;
    percentOff: number;
    duration: string;
    durationInMonths: number;
    stripeCouponId: string;
  }): Promise<Coupon> {
    const { name, percentOff, duration, durationInMonths, stripeCouponId } =
      input;

    const couponEntity = this.couponRepository.create({
      name,
      percentOff,
      duration,
      durationInMonths,
      stripeCouponId,
    });
    return this.couponRepository.save(couponEntity);
  }

  async getById(id: string): Promise<Coupon> {
    return this.couponRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }
}
