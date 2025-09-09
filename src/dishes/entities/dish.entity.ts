import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', unsigned: true })
  prepTime: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, { nullable: false })
  restaurant: Restaurant;

  @ManyToMany(() => Order, (order) => order.dishes)
  orders: Order[];
}
