import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DishesModule } from './dishes/dishes.module';
import { OrdersModule } from './orders/orders.module';
import { Dish } from './dishes/entities/dish.entity';
import { Order } from './orders/entities/order.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';

@Module({
  imports: [
    // Loads environment variables
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available everywhere
    }),

    // Async TypeORM config using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'restaurants_app_db'),
        entities: [Restaurant, Dish, Order],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // Register repositories so we can inject them
    TypeOrmModule.forFeature([Restaurant, Dish, Order]),

    // Feature modules
    RestaurantsModule,
    DishesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
