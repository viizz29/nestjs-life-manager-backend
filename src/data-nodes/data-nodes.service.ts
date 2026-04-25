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

  async searchByNote(userId: number, query: string) {
    return this.dataNodeRepo.searchByNote(userId, query);
  }

  async createTodayNode(userId: number) {
    return this.dataNodeRepo.createTodayNode(userId);
  }

  async deleteDataNode(userId: number, sn: number) {
    return this.dataNodeRepo.deleteByUserIdAndSn(userId, sn);
  }

  async updateNote(userId: number, sn: number, note: string) {
    return this.dataNodeRepo.updateNote(userId, sn, note);
  }

  async updateParentSn(userId: number, sn: number, parentSn: number) {
    return this.dataNodeRepo.updateParentSn(userId, sn, parentSn);
  }

  async updatePosition(userId: number, sn: number, position: number) {
    return this.dataNodeRepo.updatePosition(userId, sn, position);
  }

  async updateAttributes(
    userId: number,
    sn: number,
    attributes: Record<string, unknown>,
  ) {
    return this.dataNodeRepo.updateAttributes(userId, sn, attributes);
  }

  async getFullPath(userId: number, sn: number) {
    return this.dataNodeRepo.getFullPath(userId, sn);
  }
}
