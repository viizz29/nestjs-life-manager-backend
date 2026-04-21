import { Injectable } from '@nestjs/common';
import { DataNodeRepository } from './data-nodes.repository';

@Injectable()
export class DataNodesService {
  constructor(private readonly dataNodeRepo: DataNodeRepository) {}

  async findAllByUserIdAndParentSn(userId: number, parentSn: number | null) {
    return this.dataNodeRepo.findAllByUserIdAndParentSn(userId, parentSn);
  }

  async createDataNode(userId: number, note: string, parentSn: number) {
    return this.dataNodeRepo.createDataNode(userId, note, parentSn);
  }

  async deleteDataNode(userId: number, sn: number) {
    return this.dataNodeRepo.deleteByUserIdAndSn(userId, sn);
  }

  async updateNote(userId: number, sn: number, note: string) {
    return this.dataNodeRepo.updateNote(userId, sn, note);
  }
}
