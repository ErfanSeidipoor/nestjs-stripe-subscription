import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PromotionCode {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 6 })
  code!: string;

  @Column('integer', { default: 1 })
  maxRedemptions!: number;

  @Column('timestamp with time zone')
  expiresAt!: Date;

  @Column('uuid', { nullable: false })
  couponId!: string;

  @Column('varchar', { length: 255, nullable: true })
  stripePromotionCodeId!: string;

  @Column('uuid', { nullable: true })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
