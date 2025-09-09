import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepo.create(dto);
    return this.restaurantRepo.save(restaurant);
  }

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepo.find();
  }

  findOne(id: number): Promise<Restaurant | null> {
    return this.restaurantRepo.findOne({
      where: { id },
      relations: ['dishes'],
    });
  }

  async update(id: number, dto: UpdateRestaurantDto): Promise<Restaurant | null> {
    await this.restaurantRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.restaurantRepo.delete(id);
  }
}
