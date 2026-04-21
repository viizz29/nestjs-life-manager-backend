import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateDataNodeAttributesDto {
  @ApiProperty({
    example: {
      color: 'blue',
      tags: ['work', 'urgent'],
      metadata: { collapsed: false },
    },
    description: 'JSON attributes for the data node',
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  attributes!: Record<string, unknown>;
}
