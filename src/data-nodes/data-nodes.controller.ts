import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DataNodesService } from './data-nodes.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CurrentUser, type JwtUser } from 'src/common/current-user.decorator';
import { ProcessedIdParam } from 'src/common/processed-id-param.decorator';
import { CreateDataNodeDto } from './dto/create-data-node.dto';
import { UpdateDataNodeDto } from './dto/update-data-node.dto';

@Controller('v1/data-nodes')
export class DataNodesController {
  constructor(private dataNodesService: DataNodesService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @Get()
  @ApiOperation({ summary: 'Get root nodes (no parentId)' })
  findRoot(@CurrentUser() user: JwtUser) {
    return this.dataNodesService.findAllByUserIdAndParentSn(user.userId, null);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'add a new node' })
  @ApiParam({ name: 'parentId', required: true, type: String })
  @Post(':parentId')
  createDataNode(
    @ProcessedIdParam({ name: 'parentId', len: 2 }) parentId: number[],
    @Body() body: CreateDataNodeDto,
    @CurrentUser() user: JwtUser,
  ) {
    const { note } = body;

    const [, parentSn] = parentId;

    return this.dataNodesService.createDataNode(user.userId, note, parentSn);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'delete a node' })
  @ApiParam({ name: 'id', required: true, type: String })
  @Delete(':id')
  async deleteDataNode(
    @ProcessedIdParam({ name: 'id', len: 2 }) id: number[],
    @CurrentUser() user: JwtUser,
  ): Promise<{ message: string }> {
    const [, nodeSn] = id;

    await this.dataNodesService.deleteDataNode(user.userId, nodeSn);

    return { message: 'Item deleted successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'update a note' })
  @ApiParam({ name: 'id', required: true, type: String })
  @Patch(':id')
  async updateNote(
    @ProcessedIdParam({ name: 'id', len: 2 }) id: [number, number],
    @CurrentUser() user: JwtUser,
    @Body() body: CreateDataNodeDto,
  ) {
    const [, nodeSn] = id;
    const { userId } = user;
    const { note } = body;

    return this.dataNodesService.updateNote(userId, nodeSn, note);
  }
}
