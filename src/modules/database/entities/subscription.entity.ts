import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user: User) => user.subscriptions)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({
    type: 'enum',
    enum: [
      'active',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'past_due',
      'paused',
      'trialing',
      'unpaid',
    ],
  })
  stripeSubscriptionStatus!: string;

  @Column({ type: 'uuid', nullable: false })
  productPlanId!: string;

  @Column({ type: 'varchar', nullable: false })
  stripeSubscriptionId!: string;

  @Column({ type: 'timestamp', nullable: true })
  startsAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endsAt!: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  isActive!: boolean;
}
