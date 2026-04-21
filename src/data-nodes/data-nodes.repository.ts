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

  async findOneByUserIdAndSn(userId: number, sn: number) {
    return this.dataNodeModel.findOne({
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
        sn: sn,
      },
    });
  }

  async createDataNode(
    userId: number,
    note: string,
    parentSn: number,
  ): Promise<DataNode | null> {
    const dataNode = await this.dataNodeModel.create(
      {
        userId,
        sn: 1,
        note,
        parentSn,
      },
      { raw: true },
    );

    return this.findOneByUserIdAndSn(userId, dataNode.get('sn'));
  }

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

  async deleteByUserIdAndSn(userId: number, sn: number) {
    return this.dataNodeModel.destroy({
      where: {
        userId,
        sn,
      },
    });
  }

  async updateNote(userId: number, sn: number, note: string) {
    const [, [updatedRecord]] = await this.dataNodeModel.update(
      {
        note,
      },
      {
        where: {
          userId,
          sn,
        },
        returning: ['sn'],
      },
    );

    // console.log(updatedRecord);

    return this.findOneByUserIdAndSn(userId, updatedRecord.get('sn'));
  }
}
