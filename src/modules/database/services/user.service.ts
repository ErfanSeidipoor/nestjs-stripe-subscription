import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrGetUser(email: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      return existingUser;
    }
    const user = this.userRepository.create({
      email,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { stripeCustomerId },
      relations: ['subscriptions'],
    });
  }

  async updateStripeCustomerId(input: {
    userId: string;
    stripeCustomerId: string;
  }): Promise<User> {
    const { userId, stripeCustomerId } = input;

    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.stripeCustomerId = stripeCustomerId;
    return this.userRepository.save(user);
  }

  async removeUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getAll(input: { email: string }): Promise<User[]> {
    const { email } = input;

    const query = this.userRepository.createQueryBuilder('user');

    if (email) {
      query.where('user.email ILIKE :email', { email: `%${email}%` });
    }

    return query.getMany();
  }
}
