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
}
