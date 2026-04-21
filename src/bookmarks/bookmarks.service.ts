import { Injectable } from '@nestjs/common';
import { BookmarksRepository } from './bookmarks.repository';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarksRepo: BookmarksRepository) {}

  async findAllByUserId(userId: number) {
    return this.bookmarksRepo.findAllByUserId(userId);
  }

  async registerBookmark(userId: number, nodeSn: number) {
    return this.bookmarksRepo.registerBookmark(userId, nodeSn);
  }
}
