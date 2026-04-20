import { Injectable } from '@nestjs/common';
import { DataNodeRepository } from './data-nodes.repository';

@Injectable()
export class DataNodesService {
  constructor(private readonly roomRepo: DataNodeRepository) {}

  async findAllByUserIdAndParentSn(userId: number, parentSn: number | null) {
    return this.roomRepo.findAllByUserIdAndParentSn(userId, parentSn);
  }
}
