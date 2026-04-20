import { Test, TestingModule } from '@nestjs/testing';
import { DataNodesController } from './data-nodes.controller';

describe('DataNodesController', () => {
  let controller: DataNodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataNodesController],
    }).compile();

    controller = module.get<DataNodesController>(DataNodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
