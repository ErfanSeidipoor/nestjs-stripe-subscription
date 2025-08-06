import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPlan } from '../entities/product-plan.entity';

@Injectable()
export class ProductPlanService {
  constructor(
    @InjectRepository(ProductPlan)
    private readonly productPlanRepository: Repository<ProductPlan>,
  ) {}

  async create(productPlan: {
    name: string;
    description: string;
    features: string[];
    price: number;
    stripeProductId: string;
    stripePriceId: string;
  }): Promise<ProductPlan> {
    const productPlanEntity = this.productPlanRepository.create({
      name: productPlan.name,
      description: productPlan.description,
      features: productPlan.features,
      price: productPlan.price,
      stripeProductId: productPlan.stripeProductId,
      stripePriceId: productPlan.stripePriceId,
    });
    return this.productPlanRepository.save(productPlanEntity);
  }

  async updateActivation(
    productPlanId: string,
    isActive: boolean,
  ): Promise<ProductPlan> {
    const productPlan = await this.productPlanRepository.findOne({
      where: { id: productPlanId },
    });

    if (!productPlan) {
      throw new NotFoundException('Product plan not found');
    }

    productPlan.isActive = isActive;
    return await this.productPlanRepository.save(productPlan);
  }

  async getAll(input: {
    search: string;
    productPlanIds: string[];
  }): Promise<ProductPlan[]> {
    const { search, productPlanIds } = input;

    const query = this.productPlanRepository.createQueryBuilder('productPlan');

    if (search) {
      query.where('productPlan.name ILIKE :search', { search: `%${search}%` });
    }

    if (productPlanIds && productPlanIds.length > 0) {
      query.andWhere('productPlan.id IN (:...productPlanIds)', {
        productPlanIds,
      });
    }

    return query.getMany();
  }

  async getById(productPlanId: string): Promise<ProductPlan> {
    return this.productPlanRepository.findOne({
      where: { id: productPlanId },
    });
  }

  async getByStripeProductId(stripeProductId: string): Promise<ProductPlan> {
    return this.productPlanRepository.findOne({
      where: { stripeProductId },
    });
  }
}
