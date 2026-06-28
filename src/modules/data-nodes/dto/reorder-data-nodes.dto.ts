import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderNodeItemDto {
  @ApiProperty({
    example: 1,
    description: 'The serial number (sn) of the node',
    type: String,
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  id!: number[];

  @ApiProperty({ example: 0, description: 'New zero-based position' })
  @IsInt()
  @Min(0)
  position!: number;
}

export class ReorderDataNodesDto {
  @ApiProperty({
    type: [ReorderNodeItemDto],
    description: 'List of nodes to reorder',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderNodeItemDto)
  nodes!: ReorderNodeItemDto[];
}
