import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DataNode } from './data-nodes.model';

@Injectable()
export class DataNodeRepository {
  constructor(
    @InjectModel(DataNode)
    private dataNodeModel: typeof DataNode,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllByUserIdAndParentSn(userId: number, parentSn: number | null) {
    if (parentSn) {
      return this.dataNodeModel.findAll({
        attributes: [
          [fn('json_build_array', col('user_id'), col('sn')), 'id'],
          [
            fn('json_build_array', col('user_id'), col('parent_sn')),
            'parent_id',
          ],
          'note',
          'position',
          'createdAt',
          'updatedAt',
        ],
        where: {
          userId,
          parentSn,
        },
      });
    }
    return this.dataNodeModel.findAll({
      attributes: [
        [fn('json_build_array', col('user_id'), col('sn')), 'id'],
        [fn('json_build_array', col('user_id'), col('parent_sn')), 'parent_id'],
        'note',
        'position',
        'createdAt',
        'updatedAt',
      ],
      where: {
        userId,
      },
    });
  }
}
