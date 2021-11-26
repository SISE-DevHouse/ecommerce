import { Test, TestingModule } from '@nestjs/testing';
import { EntradaProductoService } from './entrada-producto.service';

describe('EntradaProductoService', () => {
  let service: EntradaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntradaProductoService],
    }).compile();

    service = module.get<EntradaProductoService>(EntradaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
