import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  stripeCouponId!: string;

  @Column('integer')
  percentOff!: number;

  @Column({
    type: 'enum',
    enum: ['once', 'repeating', 'forever'],
  })
  duration!: string;

  @Column('integer')
  durationInMonths!: number;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
