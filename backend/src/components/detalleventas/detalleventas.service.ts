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
import { DetalleventaEntity } from 'src/models/detalleventa.entity';
import { ROUNDS_BCRYPT } from 'src/config/bcrypt.config';
import { URL_Server } from 'src/config/server.config';

@Injectable()
export class DetalleventasService {

    // 1 agregamos la InjectRepository y instanciamos el Repositorio 
    constructor(
        @InjectRepository(DetalleventaEntity)
        private DetalleventaRepository: Repository<DetalleventaEntity>,
    ) { }

 
    async CreateDetalle(detalle: DetalleventaEntity): Promise<DetalleventaEntity> {

        
        return this.DetalleventaRepository.save(detalle).then(
            (resultSave: DetalleventaEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('ERROR_DETALLE_SERVICE_CREATE_DETALLE_SAVE_DETALLE');
                return resultSave;
            }
        );
    }

    async Gets(detalle: DetalleventaEntity): Promise<DetalleventaEntity[]> {

        // Hacemos where por todos los campos de la entidad
        return await this.DetalleventaRepository.find({
            where: [
                // name && surname && nick && email
                {
                    id: (detalle.id || Like('%' + '%')),
                    id_venta: (detalle.id_venta || Like('%' + '%')),
                    id_producto: (detalle.id_producto || Like('%' + '%')),
                    //cantidad: (detalle.ca || Like('%' + '%')),
                    //nick: Like('%' + (user.nick || '') + '%'),
                    //name: Like('%' + (user.name || '') + '%'),
                    //lastName: Like('%' + (user.lastName || '') + '%'),
                    //phoneNumber: Like('%' + (user.phoneNumber || '') + '%'),
                    //role: Like('%' + (user.role || '') + '%'),
                    status: Not(false)
                }
            ]
        }).then(
            (result: DetalleventaEntity[]) => {
                return result;
            }
        )
    }

    async Get(id: number): Promise<DetalleventaEntity> {

        // Hacemos una busqueda por id
        return await this.DetalleventaRepository.findOne({
            where: {
                id: id,
                status: Not(false)
            }
        }).then(
            resultFind => {
                // Validamos si encontro al usuario.
                if (!resultFind) throw new Error('user_does_not_exist');
                // Vaciamos el campo del password.
                //resultFind.password = null;
                // retornamos el objeto.
                return resultFind;
            });

    }

        async UpdateDetalleId(detalle: DetalleventaEntity): Promise<DetalleventaEntity> {
        // Contrasela antigua
        let contraseniaOld = '';

        // Hacemos una busqueda por id
        return await this.DetalleventaRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: detalle.id }
            ]
        }).then(resultFind => {

            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('user_does_not_exist');

            return this.DetalleventaRepository.update(detalle.id, detalle);
            }
        ).then(resultUpdate => {

            if (!resultUpdate) throw new Error('userRepository.update no respondio como esperabamos.');

            // borramos el password por seguridad.
            // delete user.password;
            //user.password = '';

            // Envio respuesta con el resultado recibido del ultimo paso
            return detalle;
        });
    }

    async Delete(detalleId: number): Promise<DetalleventaEntity> {

        let detalle: DetalleventaEntity = new DetalleventaEntity();

        // Eliminamos de la base de dato al usuario.
        return await this.DetalleventaRepository.findOne({
            where: [
                // hacemos un where donde buscamos por id.
                { id: detalleId }
            ]
        }).then(resultFind => {
            // Validamos si encontro al usuario.
            if (!resultFind) throw new Error('user_does_not_exist');

            // Seteamos al usuario.
            detalle = resultFind;
            // Desactivamos el estado.
            detalle.status = false;

            // Actualizamos al usuario
            return this.DetalleventaRepository.update(detalle.id, detalle);
        }).then(
            resultSave => {

                // Validamos si se actualizo correctamente.
                if (!resultSave) throw new Error('error_user_save');
                // Borramos el password.
                //user.password = '';

                return detalle;
            }
        )
    }
}
