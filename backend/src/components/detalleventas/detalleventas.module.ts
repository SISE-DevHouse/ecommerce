import { Module } from '@nestjs/common';
import { DetalleventasService } from './detalleventas.service';
import { DetalleventasController } from './detalleventas.controller';

// Dependencias TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleventaEntity } from '../../models/detalleventa.entity';
//import { MulterModule } from '@nestjs/platform-express';
//import { FOLDER_UPLOADS } from '../../config/path.config';

@Module({
  providers: [DetalleventasService],
  controllers: [DetalleventasController],

  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([DetalleventaEntity]),
  
  ],
  // Exportamos el servicio para que lo usemos desde otro lado.
  exports: [DetalleventasService],
})
export class DetalleventasModule {}
