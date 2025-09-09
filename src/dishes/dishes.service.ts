import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private dishRepo: Repository<Dish>,
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  async create(dto: CreateDishDto): Promise<Dish> {
    // Find the restaurant
    const restaurant = await this.restaurantRepo.findOneBy({ id: dto.restaurantId });
    if (!restaurant) {
      throw new BadRequestException('Restaurant not found');
    }

    // Create the dish
    const dish = this.dishRepo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      prepTime: dto.prepTime,
      restaurant,
    });

    return this.dishRepo.save(dish);
  }

  findOne(id: number): Promise<Dish | null> {
    return this.dishRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateDishDto): Promise<Dish | null> {
    await this.dishRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.dishRepo.delete(id);
  }
}
