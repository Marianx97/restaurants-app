import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { Dish } from '../dishes/entities/dish.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // Use transaction to avoid race conditions
    return await this.orderRepo.manager.transaction(async (manager) => {
      // Lock the restaurant
      const restaurant = await manager
        .getRepository(Restaurant)
        .createQueryBuilder('restaurant')
        .setLock('pessimistic_write')
        .where('restaurant.id = :id', { id: dto.restaurantId })
        .getOne();

      if (!restaurant) {
        throw new BadRequestException('Invalid restaurant');
      }

      // Check availability
      if (!restaurant.available) {
        throw new BadRequestException('Restaurant is not available');
      }

      // Fetch dishes (same transaction)
      const dishes = await manager.getRepository(Dish).find({
        where: { id: In(dto.dishes) },
      });

      if (dishes.length !== dto.dishes.length) {
        throw new BadRequestException('One or more dishes not found');
      }

      // Calculate total prep time
      const totalPrepTime = dishes.reduce((sum, dish) => sum + dish.prepTime, 0);

      // Create the order
      const order = manager.getRepository(Order).create({
        status: OrderStatus.PENDING,
        prepTime: totalPrepTime, // sum of dishes prep time
        dishes,
        restaurant,
      });

      await manager.getRepository(Order).save(order);

      // Update restaurant currentOrders
      restaurant.currentOrders += 1;
      if (restaurant.currentOrders >= restaurant.maxOrders) {
        restaurant.available = false;
      }

      await manager.getRepository(Restaurant).save(restaurant);

      return order;
    });
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['dishes'] })
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['dishes'],
    });
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    return await this.orderRepo.manager.transaction(async (manager) => {
      // Load the order with its restaurant (lock restaurant row)
      const order = await manager.getRepository(Order).findOne({
        where: { id },
        relations: ['restaurant'],
      });

      if (!order) return null;

      // Lock the restaurant row
      const restaurant = await manager
        .getRepository(Restaurant)
        .createQueryBuilder('restaurant')
        .setLock('pessimistic_write')
        .where('restaurant.id = :id', { id: order.restaurant.id })
        .getOne();

      if (!restaurant) return null;

      // Track if we need to decrement currentOrders
      const willDecrement = order.status !== 'ready' && dto.status === 'ready';

      // Update order status
      order.status = dto.status;
      await manager.getRepository(Order).save(order);

      // If order is now ready -> decrement currentOrders
      if (willDecrement) {
        restaurant.currentOrders = Math.max(0, restaurant.currentOrders - 1);

        // if restaurant was full, make it available again
        if (!restaurant.available && restaurant.currentOrders < restaurant.maxOrders) {
          restaurant.available = true;
        }

        await manager.getRepository(Restaurant).save(restaurant);
      }

      return order;
    });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepo.manager.transaction(async (manager) => {
      // Load the order with its restaurant
      const order = await manager.getRepository(Order).findOne({
        where: { id },
        relations: ['restaurant'],
      });

      if (!order) return;

      // Lock the restaurant row
      const restaurant = await manager
        .getRepository(Restaurant)
        .createQueryBuilder('restaurant')
        .setLock('pessimistic_write')
        .where('restaurant.id = :id', { id: order.restaurant.id })
        .getOne();

      if (!restaurant) return;

      // If the order wasn't already "ready", decrement
      if (order.status !== 'ready') {
        restaurant.currentOrders = Math.max(0, restaurant.currentOrders - 1);

        if (!restaurant.available && restaurant.currentOrders < restaurant.maxOrders) {
          restaurant.available = true;
        }

        await manager.getRepository(Restaurant).save(restaurant);
      }

      // Delete the order
      await manager.getRepository(Order).delete(id);
    });
  }
}
