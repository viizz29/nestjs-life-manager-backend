import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Bookmark } from './bookmarks.model';
import { DataNode } from 'src/data-nodes/data-nodes.model';

@Injectable()
export class BookmarksRepository {
  constructor(
    @InjectModel(Bookmark)
    private readonly bookmarkModel: typeof Bookmark,
    @InjectModel(DataNode)
    private readonly dataNodeModel: typeof DataNode,
    private readonly sequelize: Sequelize,
  ) {}

  async findAllByUserId(userId: number) {
    return this.sequelize.query(
      `
        SELECT
          json_build_array(b.user_id, b.node_sn) AS node_id,
          json_build_array(d.user_id, d.parent_sn) AS parent_id,
          d.note,
          d.attributes,
          d.position,
          b.created_at,
          b.updated_at
        FROM bookmarks b
        INNER JOIN data_nodes d
          ON d.user_id = b.user_id
         AND d.sn = b.node_sn
        WHERE b.user_id = :userId
        ORDER BY b.created_at DESC, b.node_sn DESC
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );
  }

  async registerBookmark(userId: number, nodeSn: number) {
    const node = await this.dataNodeModel.findOne({
      where: {
        userId,
        sn: nodeSn,
      },
    });

    if (!node) {
      throw new NotFoundException('Data node not found');
    }

    const [bookmark] = await this.bookmarkModel.findOrCreate({
      where: {
        userId,
        nodeSn,
      },
      defaults: {
        userId,
        nodeSn,
      },
      raw: true,
    });

    return {
      id: [bookmark.userId, bookmark.nodeSn],
    };
  }
}
