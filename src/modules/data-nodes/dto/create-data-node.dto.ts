import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDataNodeDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
