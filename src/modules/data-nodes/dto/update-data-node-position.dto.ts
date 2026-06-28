import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateDataNodePositionDto {
  @ApiProperty({
    example: 2,
    description: 'New zero-based position within the node parent children list',
  })
  @IsInt()
  @Min(0)
  position!: number;
}
