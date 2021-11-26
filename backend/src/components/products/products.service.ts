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
import { GetDate } from 'src/assets/moment.assets';


@Injectable()
export class ProductsService {

    // 1 agregamos la InjectRepository y instanciamos el Repositorio 
    constructor(
        @InjectRepository(ProductEntity)
        private _productRepository: Repository<ProductEntity>,
    ) { }

    async CreateProduct(product: ProductEntity,userCreateId:number): Promise<ProductEntity> {

        // auditoria
        product.userIdCreated = userCreateId;
        product.dateCreated = GetDate();
        product.status = Boolean(product.status);

        // buscamos si el nick o email ya esta en uso.
        return await this._productRepository.save(product).then(
            (resultSave: ProductEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_PRODUCT_SERVICE_CREATE');
                return resultSave;
            }
        );
    }

    async GetProducts(product: ProductEntity): Promise<ProductEntity[]> {

        // Hacemos where por todos los campos de la entidad
        return await this._productRepository.find({
            where: [
                // name && surname && nick && email
                {
                    id: Like('%' + (product.id || '') + '%'),
                    nombre: Like('%' + (product.nombre || '') + '%'),
                    codigo: Like('%' + (product.codigo || '') + '%'),
                    descripcion: Like('%' + (product.descripcion || '') + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: ProductEntity[]) => {
                return result;
            }
        )
    }

    async GetProduct(id: number): Promise<ProductEntity> {

        // Hacemos una busqueda por id
        return await this._productRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('product_does_not_exist');
                // Vaciamos el campo del password.
                //resultFind.password = null;
                // retornamos el objeto.
                return resultFind;
            }
        );

    }

    async UpdateProduct(id:number, product : ProductEntity, idUserUpdate:number): Promise<ProductEntity> {
   
        product.id = Number(id);
        // auditoria
        product.userIdUpdated = idUserUpdate;
        product.dateUpdated = GetDate();
        product.status = Boolean(product.status);

        // Hacemos una busqueda por id
        return await this._productRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: product.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('product_does_not_exist');

            return this._productRepository.update(product.id, product);
        }
        ).then(resultUpdate => {

            if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

            // borramos el password por seguridad.
            // delete user.password;
            //user.password = '';

            // Envio respuesta con el resultado recibido del ultimo paso
            return product;
        });
    }

    async DeleteProduct(productId: number,idUserDelete: number): Promise<ProductEntity> { 

        let deleteProduct: ProductEntity = new ProductEntity();

        // Eliminamos de la base de dato al usuario.
        return await this._productRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: productId }
            ]
        }).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('user_does_not_exist');

            // Seteamos al usuario.
            deleteProduct = resultFind;

            // auditoria
            deleteProduct.userIdUpdated = idUserDelete;
            deleteProduct.dateUpdated = GetDate();
            deleteProduct.status = false;

            // Actualizamos al usuario
            return this._productRepository.update(deleteProduct.id, deleteProduct);
        }).then(
            resultSave => {

                // Validamos si se actualizo correctamente.
                if (!resultSave) throw new Error('error_user_save');

                return deleteProduct;

            }
        )
    }
}
