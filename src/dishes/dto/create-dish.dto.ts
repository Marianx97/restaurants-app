import { IsInt, IsNumber, IsString, Min } from "class-validator";

export class CreateDishDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0.0)
  price: number;

  @IsNumber()
  @Min(1)
  prepTime: number;

  @IsInt()
  restaurantId: number;
}
