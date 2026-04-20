// decode-hashid.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import Hashids from 'hashids';
import { HASHID_SALT } from 'src/config';

const hashids = new Hashids(HASHID_SALT, 10);

@Injectable()
export class DecodeHashIdPipe implements PipeTransform {
  transform(value: string) {
    const decoded = hashids.decode(value);

    if (!decoded.length) {
      throw new BadRequestException('Invalid ID');
    }

    return decoded;
    // return decoded[0]; // 👈 original numeric ID
  }
}
