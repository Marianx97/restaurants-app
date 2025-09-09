import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource, Repository } from 'typeorm';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Dish } from './dishes/entities/dish.entity';
import { Order } from './orders/entities/order.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const restaurantRepo = app.get<Repository<Restaurant>>('RestaurantRepository');
  const dishRepo = app.get<Repository<Dish>>('DishRepository');
  const orderRepo = app.get<Repository<Order>>('OrderRepository')

  // Clear old data [don’t care about constraints during seeding - temporarily disable]
  await app.get(DataSource).query('SET FOREIGN_KEY_CHECKS = 0;');
  await orderRepo.clear();
  await dishRepo.clear();
  await restaurantRepo.clear();
  await app.get(DataSource).query('SET FOREIGN_KEY_CHECKS = 1;');

  // Restaurant 1
  const burgerRestaurant = restaurantRepo.create({
    name: 'Burger Palace',
    description: 'The best burgers of the kingdom',
    available: true,
    maxOrders: 10,
    currentOrders: 0,
  });
  await restaurantRepo.save(burgerRestaurant);

  const burgerDish1 = dishRepo.create({
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and house sauce',
    price: 9.99,
    prepTime: 15,
    restaurant: burgerRestaurant,
  });
  await dishRepo.save(burgerDish1);

  const burgerDish2 = dishRepo.create({
    name: 'Bacon BBQ Burger',
    description: 'Smoky bacon, crispy onions, and tangy BBQ sauce on a toasted bun',
    price: 11.49,
    prepTime: 20,
    restaurant: burgerRestaurant,
  });
  await dishRepo.save(burgerDish2);

  const burgerDish3 = dishRepo.create({
    name: 'Veggie Burger Deluxe',
    description: 'Grilled plant-based patty with avocado, lettuce, and chipotle mayo',
    price: 10.99,
    prepTime: 18,
    restaurant: burgerRestaurant,
  });
  await dishRepo.save(burgerDish3);

  // Restaurant 2
  const veggieRestaurant = restaurantRepo.create({
    name: 'Veggie House',
    description: 'Tasty and healthy, the way you like it',
    available: true,
    maxOrders: 8,
    currentOrders: 0,
  });
  await restaurantRepo.save(veggieRestaurant);

  const veggieDish1 = dishRepo.create({
    name: 'Mediterranean Bowl',
    description: 'Quinoa, roasted chickpeas, hummus, cucumber, tomato, and tahini dressing',
    price: 12.50,
    prepTime: 12,
    restaurant: veggieRestaurant,
  });
  await dishRepo.save(veggieDish1);

  const veggieDish2 = dishRepo.create({
    name: 'Grilled Veggie Wrap',
    description: 'Zucchini, bell peppers, and eggplant wrapped with spinach tortilla and pesto',
    price: 9.75,
    prepTime: 10,
    restaurant: veggieRestaurant,
  });
  await dishRepo.save(veggieDish2);

  const veggieDish3 = dishRepo.create({
    name: 'Vegan Power Salad',
    description: 'Kale, sweet potato, walnuts, cranberries, and citrus vinaigrette',
    price: 11.25,
    prepTime: 14,
    restaurant: veggieRestaurant,
  });
  await dishRepo.save(veggieDish3);

  // Restaurant 3
  const sushiRestaurant = restaurantRepo.create({
    name: 'Sushi Bar',
    description: 'The best sushi outside of Japan',
    available: true,
    maxOrders: 5,
    currentOrders: 0,
  });
  await restaurantRepo.save(sushiRestaurant);

  const sushiDish1 = dishRepo.create({
    name: 'California Roll',
    description: 'Crab stick, avocado, cucumber, and sesame seeds',
    price: 7.99,
    prepTime: 8,
    restaurant: sushiRestaurant,
  });
  await dishRepo.save(sushiDish1);

  const sushiDish2 = dishRepo.create({
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over seasoned rice with wasabi',
    price: 10.50,
    prepTime: 6,
    restaurant: sushiRestaurant,
  });
  await dishRepo.save(sushiDish2);

  const sushiDish3 = dishRepo.create({
    name: 'Dragon Roll',
    description: 'Eel, cucumber, topped with avocado and sweet soy glaze',
    price: 13.25,
    prepTime: 12,
    restaurant: sushiRestaurant,
  });
  await dishRepo.save(sushiDish3);


  console.log('Database seeded with realistic data!');
  await app.close();
}

bootstrap();
