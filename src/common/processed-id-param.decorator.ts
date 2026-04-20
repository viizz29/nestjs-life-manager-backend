import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { decodeValue } from './decode-id.pipe';

export const ProcessedIdParam = createParamDecorator(
  (param: { name: string; len: number }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[param.name];

    const newValue: number[] = decodeValue(value);

    if (newValue.length != param.len) {
      throw new BadRequestException(`Invalid value for ${param.name}`);
    }

    return newValue;
  },
);
