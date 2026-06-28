import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'bookmarks',
  timestamps: true,
})
export class Bookmark extends Model {
  @PrimaryKey
  @Column
  userId!: number;

  @PrimaryKey
  @Column
  nodeSn!: number;
}
