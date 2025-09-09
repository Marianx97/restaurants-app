import { IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  available?: boolean;

  @IsInt()
  @Min(1)
  maxOrders: number;

  @IsInt()
  currentOrders?: number;
}
