import { Module } from '@nestjs/common';
import { EntradaProductoService } from './entrada-producto.service';
import { EntradaProductoController } from './entrada-producto.controller';

@Module({
  providers: [EntradaProductoService],
  controllers: [EntradaProductoController]
})
export class EntradaProductoModule {}
