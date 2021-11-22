import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

// Dependencias TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../models/product.entity';
//import { MulterModule } from '@nestjs/platform-express';
//import { FOLDER_UPLOADS } from '../../config/path.config';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
    //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
    imports: [
      TypeOrmModule.forFeature([ProductEntity]),
    
    ],
    // Exportamos el servicio para que lo usemos desde otro lado.
    exports: [ProductsService],
})

export class ProductsModule {

}
