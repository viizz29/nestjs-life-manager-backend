import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DataNodesService } from './data-nodes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { ProcessedIdParam } from 'src/common/processed-id-param.decorator';

@Controller('v1/data-nodes')
export class DataNodesController {
  constructor(private dataNodesService: DataNodesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({ summary: 'Get root nodes (no parentId)' })
  findRoot(@CurrentUser() user: JwtUser) {
    return this.dataNodesService.findAllByUserIdAndParentSn(user.userId, null);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get(':parentId')
  @ApiOperation({ summary: 'Get nodes by parentId' })
  @ApiParam({ name: 'parentId', required: true, type: String })
  findByParent(
    @ProcessedIdParam({ name: 'parentId', len: 2 }) parentId: number[],
    @CurrentUser() user: JwtUser,
  ) {
    const [, parentSn] = parentId;

    console.log({ parentSn });

    return this.dataNodesService.findAllByUserIdAndParentSn(
      user.userId,
      parentSn,
    );
  }
}
