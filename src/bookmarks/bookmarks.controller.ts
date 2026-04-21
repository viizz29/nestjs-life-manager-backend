import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { ProcessedIdParam } from 'src/common/processed-id-param.decorator';
import { BookmarksService } from './bookmarks.service';

@Controller('v1/bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @Get()
  @ApiOperation({ summary: 'Get bookmark list' })
  findAll(@CurrentUser() user: JwtUser) {
    return this.bookmarksService.findAllByUserId(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @Post(':nodeId')
  @ApiOperation({ summary: 'Register a bookmark for a node' })
  @ApiParam({ name: 'nodeId', required: true, type: String })
  registerBookmark(
    @ProcessedIdParam({ name: 'nodeId', len: 2 }) nodeId: [number, number],
    @CurrentUser() user: JwtUser,
  ) {
    const [, nodeSn] = nodeId;

    return this.bookmarksService.registerBookmark(user.userId, nodeSn);
  }
}
