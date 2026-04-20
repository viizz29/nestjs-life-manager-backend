import { Test, TestingModule } from '@nestjs/testing';
import { DataNodesService } from './data-nodes.service';

describe('DataNodesService', () => {
  let service: DataNodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataNodesService],
    }).compile();

    service = module.get<DataNodesService>(DataNodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
