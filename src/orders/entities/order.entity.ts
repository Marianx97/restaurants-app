import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Dish } from '../../dishes/entities/dish.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROCESS = 'in process',
  READY = 'ready',
  CANCELED = 'canceled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ type: 'int', unsigned: true })
  prepTime: number;

  @ManyToMany(() => Dish, (dish) => dish.orders, { cascade: true })
  @JoinTable()
  dishes: Dish[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, { nullable: false })
  restaurant: Restaurant;
}
