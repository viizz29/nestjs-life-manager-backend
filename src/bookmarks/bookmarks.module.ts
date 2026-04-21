import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bookmark } from './bookmarks.model';
import { BookmarksRepository } from './bookmarks.repository';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { DataNode } from 'src/data-nodes/data-nodes.model';

@Module({
  imports: [SequelizeModule.forFeature([Bookmark, DataNode])],
  providers: [BookmarksRepository, BookmarksService],
  controllers: [BookmarksController],
})
export class BookmarksModule {}
