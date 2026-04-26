import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DataNode } from './data-nodes.model';

@Injectable()
export class DataNodeRepository {
  constructor(
    @InjectModel(DataNode)
    private dataNodeModel: typeof DataNode,
    private readonly sequelize: Sequelize,
  ) {}

  private getSiblingWhere(userId: number, parentSn: number | null) {
    return {
      userId,
      ...(parentSn === null ? { parentSn: null } : { parentSn }),
    };
  }

  async findOneByUserIdAndSn(userId: number, sn: number) {
    return this.dataNodeModel.findOne({
      attributes: [
        [fn('json_build_array', col('user_id'), col('sn')), 'id'],
        [fn('json_build_array', col('user_id'), col('parent_sn')), 'parent_id'],
        'note',
        'attributes',
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

  private async findOneByUserIdAndSnWithTransaction(
    userId: number,
    sn: number,
    transaction: Transaction,
  ) {
    return this.dataNodeModel.findOne({
      attributes: [
        [fn('json_build_array', col('user_id'), col('sn')), 'id'],
        [fn('json_build_array', col('user_id'), col('parent_sn')), 'parent_id'],
        'note',
        'attributes',
        'position',
        'createdAt',
        'updatedAt',
      ],
      where: {
        userId,
        sn,
      },
      transaction,
    });
  }

  private async findNodeByUserIdParentSnAndNote(
    userId: number,
    parentSn: number | null,
    note: string,
    transaction: Transaction,
  ) {
    return this.dataNodeModel.findOne({
      where: {
        userId,
        ...(parentSn === null ? { parentSn: null } : { parentSn }),
        note,
      },
      order: [['position', 'ASC']],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
  }

  private async createChildNode(
    userId: number,
    parentSn: number | null,
    note: string,
    transaction: Transaction,
  ) {
    const siblingCount = await this.dataNodeModel.count({
      where: this.getSiblingWhere(userId, parentSn),
      transaction,
    });

    return this.dataNodeModel.create(
      {
        userId,
        sn: 1,
        note,
        parentSn,
        position: siblingCount,
      },
      {
        transaction,
      },
    );
  }

  private async findOrCreateNodeByPathPart(
    userId: number,
    parentSn: number | null,
    note: string,
    transaction: Transaction,
  ) {
    const existingNode = await this.findNodeByUserIdParentSnAndNote(
      userId,
      parentSn,
      note,
      transaction,
    );

    if (existingNode) {
      return existingNode;
    }

    return this.createChildNode(userId, parentSn, note, transaction);
  }

  async createTodayNode(userId: number) {
    return this.sequelize.transaction(async (transaction) => {
      const today = new Date();
      const yearNote = String(today.getUTCFullYear());
      const monthNote = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        timeZone: 'UTC',
      }).format(today);
      const dayNote = String(today.getUTCDate());

      const lifeNode = await this.findOrCreateNodeByPathPart(
        userId,
        null,
        'life',
        transaction,
      );

      const yearNode = await this.findOrCreateNodeByPathPart(
        userId,
        lifeNode.get('sn'),
        yearNote,
        transaction,
      );

      const monthNode = await this.findOrCreateNodeByPathPart(
        userId,
        yearNode.get('sn'),
        monthNote,
        transaction,
      );
      const dayNode = await this.findOrCreateNodeByPathPart(
        userId,
        monthNode.get('sn'),
        dayNote,
        transaction,
      );

      return [userId, dayNode.get('sn')];
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
          'attributes',
          'position',
          'createdAt',
          'updatedAt',
        ],
        where: {
          userId,
          parentSn,
        },
        order: [['position', 'ASC']],
      });
    }
    return this.dataNodeModel.findAll({
      attributes: [
        [fn('json_build_array', col('user_id'), col('sn')), 'id'],
        [fn('json_build_array', col('user_id'), col('parent_sn')), 'parent_id'],
        'note',
        'attributes',
        'position',
        'createdAt',
        'updatedAt',
      ],
      where: {
        userId,
        parentSn: null,
      },
    });
  }

  async searchByNote(userId: number, query: string) {
    return this.dataNodeModel.findAll({
      attributes: [
        [fn('json_build_array', col('user_id'), col('sn')), 'id'],
        [fn('json_build_array', col('user_id'), col('parent_sn')), 'parent_id'],
        'note',
        'attributes',
        'position',
        'createdAt',
        'updatedAt',
      ],
      where: {
        userId,
        note: {
          [Op.iLike]: `%${query}%`,
        },
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

  async updateParentSn(userId: number, sn: number, parentSn: number) {
    const [, [updatedRecord]] = await this.dataNodeModel.update(
      {
        parentSn,
      },
      {
        where: {
          userId,
          sn,
        },
        returning: ['sn'],
      },
    );

    return this.findOneByUserIdAndSn(userId, updatedRecord.get('sn'));
  }

  async updatePosition(userId: number, sn: number, newPosition: number) {
    return this.sequelize.transaction(async (transaction) => {
      const targetNode = await this.dataNodeModel.findOne({
        where: {
          userId,
          sn,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!targetNode) {
        throw new NotFoundException('Data node not found');
      }

      const parentSn = targetNode.parentSn ?? null;
      const currentPosition = targetNode.position;

      const siblingWhere = this.getSiblingWhere(userId, parentSn);

      const siblingCount = await this.dataNodeModel.count({
        where: siblingWhere,
        transaction,
      });

      const maxPosition = Math.max(0, siblingCount - 1);
      const normalizedPosition = Math.min(newPosition, maxPosition);

      if (normalizedPosition === currentPosition) {
        return this.findOneByUserIdAndSn(userId, sn);
      }

      if (normalizedPosition < currentPosition) {
        await this.dataNodeModel.increment(
          { position: 1 },
          {
            where: {
              ...siblingWhere,
              sn: {
                [Op.ne]: sn,
              },
              position: {
                [Op.gte]: normalizedPosition,
                [Op.lt]: currentPosition,
              },
            },
            transaction,
          },
        );
      } else {
        await this.dataNodeModel.decrement(
          { position: 1 },
          {
            where: {
              ...siblingWhere,
              sn: {
                [Op.ne]: sn,
              },
              position: {
                [Op.gt]: currentPosition,
                [Op.lte]: normalizedPosition,
              },
            },
            transaction,
          },
        );
      }

      await targetNode.update(
        {
          position: normalizedPosition,
        },
        {
          transaction,
        },
      );

      return this.findOneByUserIdAndSnWithTransaction(userId, sn, transaction);
    });
  }

  async updateAttributes(
    userId: number,
    sn: number,
    attributes: Record<string, unknown>,
  ) {
    const [, [updatedRecord]] = await this.dataNodeModel.update(
      {
        attributes,
      },
      {
        where: {
          userId,
          sn,
        },
        returning: ['sn'],
      },
    );

    return this.findOneByUserIdAndSn(userId, updatedRecord.get('sn'));
  }

  async getFullPath(userId: number, sn: number) {
    // recursively find the nodes until parentsn is null
    const nodes: DataNode[] = [];

    let currentNodeSn: number = sn;

    while (currentNodeSn) {
      const node = await this.dataNodeModel.findOne({
        attributes: [
          [fn('json_build_array', col('user_id'), col('sn')), 'id'],
          'note',
          'parentSn',
        ],
        where: {
          userId,
          sn: currentNodeSn,
        },
        raw: true,
      });

      console.log({ node });

      if (!node) break;

      nodes.push(node);
      currentNodeSn = node?.parentSn;
    }

    return nodes.map((item) => ({ id: item.id, note: item.note })).reverse();
  }

  async reorderNodes(
    userId: number,
    nodes: { sn: number; position: number }[],
  ) {
    return this.sequelize.transaction(async (transaction) => {
      for (const node of nodes) {
        await this.dataNodeModel.update(
          { position: node.position },
          {
            where: {
              userId,
              sn: node.sn,
            },
            transaction,
          },
        );
      }
      return { success: true };
    });
  }
}
