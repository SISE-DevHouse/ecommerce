import { Module } from '@nestjs/common';
import { EntradaProductoService } from './entrada-producto.service';
import { EntradaProductoController } from './entrada-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaProductoEntity } from 'src/models/entrada-producto.entity';

@Module({
  providers: [EntradaProductoService],
  controllers: [EntradaProductoController],
  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([EntradaProductoEntity]),
  ],
  // Exportamos el servicio para que lo usemos desde otro lado.
  exports: [EntradaProductoService],
})
export class EntradaProductoModule {}
