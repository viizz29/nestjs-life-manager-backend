import { Module } from '@nestjs/common';
import { DataNodesService } from './data-nodes.service';
import { DataNodesController } from './data-nodes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataNode } from './data-nodes.model';
import { DataNodeRepository } from './data-nodes.repository';

@Module({
  imports: [SequelizeModule.forFeature([DataNode])],
  providers: [DataNodesService, DataNodeRepository],
  controllers: [DataNodesController],
  exports: [DataNodeRepository],
})
export class DataNodesModule {}
