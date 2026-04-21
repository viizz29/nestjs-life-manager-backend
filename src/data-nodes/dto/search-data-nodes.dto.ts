import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchDataNodesDto {
  @ApiProperty({
    example: 'meeting notes',
    description: 'Text to search for inside data node notes',
  })
  @IsString()
  @IsNotEmpty()
  query!: string;
}
