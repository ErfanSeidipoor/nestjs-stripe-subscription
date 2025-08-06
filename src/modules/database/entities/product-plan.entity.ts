import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 500 })
  description!: string;

  @Column('text', { array: true })
  features!: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('varchar', { length: 255, nullable: true })
  stripeProductId: string;

  @Column('varchar', { length: 255, nullable: true })
  stripePriceId: string;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
