import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDataNodeDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
