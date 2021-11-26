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
import { EntradaProductoEntity } from 'src/models/entrada-producto.entity';
import { ROUNDS_BCRYPT } from 'src/config/bcrypt.config';
import { URL_Server } from 'src/config/server.config';
import { GetDate } from 'src/assets/moment.assets';

@Injectable()
export class EntradaProductoService {

    // 1 agregamos la InjectRepository y instanciamos el Repositorio 
    constructor(
        @InjectRepository(EntradaProductoEntity)
        private _entradaProductoRepository: Repository<EntradaProductoEntity>,
    ) { }


    async Create(entradaProducto: EntradaProductoEntity, userCreateId: number): Promise<EntradaProductoEntity> {

        // auditoria
        entradaProducto.userIdCreated = userCreateId;
        entradaProducto.dateCreated = GetDate();
        entradaProducto.status = Boolean(entradaProducto.status);

        // buscamos si el nick o email ya esta en uso.
        return await this._entradaProductoRepository.save(entradaProducto).then(
            (resultSave: EntradaProductoEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_ENTRADA_PRODUCTO_SERVICE_CREATE');
                return resultSave;
            }
        );
    }

    async Gets(entradaProducto: EntradaProductoEntity): Promise<EntradaProductoEntity[]> {

        // Hacemos where por todos los campos de la entidad
        return await this._entradaProductoRepository.find({
            where: [
                // name && surname && nick && email
                {
                    id: Like('%' + (entradaProducto.id || '') + '%'),
                    costo_unitario: Like('%' + (entradaProducto.costo_unitario || '') + '%'),
                    fecha: Like('%' + (entradaProducto.fecha || '') + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: EntradaProductoEntity[]) => {
                return result;
            }
        )
    }

    async Get(id: number): Promise<EntradaProductoEntity> {

        // Hacemos una busqueda por id
        return await this._entradaProductoRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('entry_product_does_not_exist');
                // Vaciamos el campo del password.
                //resultFind.password = null;
                // retornamos el objeto.
                return resultFind;
            }
        );

    }

    async Update(id: number, entradaProductoEntity: EntradaProductoEntity, idUserUpdate: number): Promise<EntradaProductoEntity> {

        entradaProductoEntity.id = Number(id);
        // auditoria
        entradaProductoEntity.userIdUpdated = idUserUpdate;
        entradaProductoEntity.dateUpdated = GetDate();
        entradaProductoEntity.status = Boolean(entradaProductoEntity.status);

        // Hacemos una busqueda por id
        return await this._entradaProductoRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: entradaProductoEntity.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('entry_product_does_not_exist');

            return this._entradaProductoRepository.update(entradaProductoEntity.id, entradaProductoEntity);
        }
        ).then(resultUpdate => {

            if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

            // borramos el password por seguridad.
            // delete user.password;
            //user.password = '';

            // Envio respuesta con el resultado recibido del ultimo paso
            return entradaProductoEntity;
        });
    }

    async Delete(entradaProductoId: number, idUserDelete: number): Promise<EntradaProductoEntity> {

        let delteEntradaProducto: EntradaProductoEntity = new EntradaProductoEntity();

        // Eliminamos de la base de dato al usuario.
        return await this._entradaProductoRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: entradaProductoId }
            ]
        }).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('entry_product_does_not_exist');

            // Seteamos al usuario.
            delteEntradaProducto = resultFind;

            // auditoria
            delteEntradaProducto.userIdUpdated = idUserDelete;
            delteEntradaProducto.dateUpdated = GetDate();
            delteEntradaProducto.status = false;

            // Actualizamos al usuario
            return this._entradaProductoRepository.update(delteEntradaProducto.id, delteEntradaProducto);
        }).then(
            resultSave => {

                // Validamos si se actualizo correctamente.
                if (!resultSave) throw new Error('error_user_save');

                return delteEntradaProducto;

            }
        )
    }
}
