import { Test, TestingModule } from '@nestjs/testing';
import { EntradaProductoController } from './entrada-producto.controller';

describe('EntradaProductoController', () => {
  let controller: EntradaProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntradaProductoController],
    }).compile();

    controller = module.get<EntradaProductoController>(EntradaProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
