import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Dish } from 'src/dishes/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, Dish])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
