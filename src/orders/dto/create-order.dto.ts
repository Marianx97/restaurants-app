import { ArrayMinSize, IsArray, IsBoolean, IsInt, Min } from 'class-validator';
// import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  // @IsBoolean()
  // status: OrderStatus;

  // @IsInt()
  // @Min(1)
  // prepTime: number

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  dishes: number[];

  @IsInt()
  restaurantId: number;
}
