import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  stripeCustomerId!: string;

  @OneToMany(() => Subscription, (sub: Subscription) => sub.user)
  subscriptions!: Subscription[];
}
