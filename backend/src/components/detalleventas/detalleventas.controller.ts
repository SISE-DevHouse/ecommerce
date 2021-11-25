import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// Si es una class lo tego que poner en el constructor y como proverdor del modulo
// 1 Importo los servicios
import { DetalleventasService } from './detalleventas.service';
import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';
import { diskStorage } from 'multer';
import { GetDate } from '../../assets/moment.assets';


// Entity
import { UserEntity } from '../../models/user.entity';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EditFileName, ImageFileFilter } from '../../middleware/image.middleware';
import { FOLDER_UPLOADS } from '../../config/path.config';
import { DetalleventaEntity } from 'src/models/detalleventa.entity';

@Controller('detalleventas')
export class DetalleventasController {
    constructor(
        private readonly _detalleService: DetalleventasService,
    ) { }

    @Post('create')
    async Create(@Headers() headers, @Body() Detalleventa: DetalleventaEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                // Validamos que los datos sean los necesarios.
                if (Detalleventa && Detalleventa.id && Detalleventa.id_producto && Detalleventa.id_venta && Detalleventa.precio && Detalleventa.cantidad) {

                    Detalleventa.userIdCreated = headerToken.id;
                    Detalleventa.dateCreated = GetDate();
                    delete Detalleventa.userIdUpdated;
                    delete Detalleventa.dateUpdated;
                    Detalleventa.status = Boolean(Detalleventa.status);

                    // retornamos la respuesta del servicio.
                    return this._detalleService.CreateDetalle(Detalleventa);
                } else {
                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultCreate: DetalleventaEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultCreate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get()
    async Gets(@Headers() headers, @Query() Detalleventa: DetalleventaEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (headerToken && (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') && Detalleventa) {

                    // Ejecutamos el servicio de obtener sailingAnalities.
                    return this._detalleService.Gets(Detalleventa);

                } else {
                    if (Number(Detalleventa.id) === Number(headerToken.id)) {
                        // Ejecutamos el servicio de obtener sailingAnalities.
                        return this._detalleService.Gets(Detalleventa);
                    } else {
                        throw new Error('MISSING_FIELS');
                    }
                }

            }
        ).then(
            (results: DetalleventaEntity[]) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: results
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }
    
    @Get(':id')
    async Get(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (result: Boolean) => {

                // Convertimos a numeros.
                let detalleId = Number(id);

                // Validamos que los datos recibidos sean los correctos.
                if (detalleId && headerToken.id) {

                    // Validamos si es un admin o un support.
                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // No hacemos nada.
                    } else {
                        // caso contrario verificamos si el id es el mismo.
                        if (headerToken.id !== id) throw new Error('ERROR_USERID_FAIL');
                    }

                    return this._detalleService.Get(detalleId);


                } else {
                    // caso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }

            }
        ).then(
            (resultGet: DetalleventaEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultGet
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Put(':id/update')
    async UpdateDetalle(@Headers() headers, @Param('id') id, @Body() detalle: DetalleventaEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                if (!isNaN(id) && detalle && detalle.cantidad && detalle.precio) {

                    detalle.id = Number(id);

                    delete detalle.userIdCreated;
                    delete detalle.dateCreated;
                    detalle.userIdUpdated = headerToken.id;
                    detalle.dateUpdated = GetDate();

                    detalle.status = Boolean(detalle.status);



                    // retornamos la respuesta del servicio.
                    return this._detalleService.UpdateDetalleId(detalle);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultUpdate: DetalleventaEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultUpdate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );

    }

    @Delete(':id/delete')
    async delete(@Headers() headers, @Param('id') id): Promise<any> {


        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);


        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // que solo puedan registrar un nuevo usuario los administradores o support.
                if (!(headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT')) {
                    throw new Error('Se esta intentado registrar con un rol no valido.');
                }

                // Validamos que esten los campos necesarios.
                if (Number(id)) {
                    // retornamos la respuesta del servicio.
                    return this._detalleService.Delete(id);
                } else {
                    // aso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }
            }
        ).then(
            (resultUpdate: DetalleventaEntity) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultUpdate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }
}
