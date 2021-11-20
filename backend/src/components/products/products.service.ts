import { Injectable } from '@nestjs/common';

// Librerias de TypeOrm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { Like } from "typeorm";
import { Not } from "typeorm";

// Otras librerias. 
import * as bcrypt from 'bcrypt';
import { DummyPromise } from '../../assets/promises.assets';
import { UserEntity } from 'src/models/user.entity';
import { ProductEntity } from 'src/models/product.entity';
import { ROUNDS_BCRYPT } from 'src/config/bcrypt.config';
import { URL_Server } from 'src/config/server.config';


@Injectable()
export class ProductsService {

// 1 agregamos la InjectRepository y instanciamos el Repositorio 
constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
) { }

async CreateProduct(product: ProductEntity): Promise<ProductEntity> {

    // buscamos si el nick o email ya esta en uso.
    return await this.productRepository.save(product).then(
        (resultSave: ProductEntity) => {
            // Validamos si encontro al usuario.
            if (!resultSave) throw new Error('ERROR_PRODUCT_SERVICE_CREATE');
            return resultSave;
        }
    );
}

}
