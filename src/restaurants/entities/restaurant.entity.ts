import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dish } from '../../dishes/entities/dish.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'int', unsigned: true })
  maxOrders: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  currentOrders: number;

  @OneToMany(() => Dish, (dish) => dish.restaurant)
  dishes: Dish[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];
}
