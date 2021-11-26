import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// Si es una class lo tego que poner en el constructor y como proverdor del modulo
// 1 Importo los servicios
import { ProductsService } from './products.service';
import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';
import { diskStorage } from 'multer';
import { GetDate } from '../../assets/moment.assets';


// Entity
import { UserEntity } from '../../models/user.entity';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EditFileName, ImageFileFilter } from '../../middleware/image.middleware';
import { FOLDER_UPLOADS } from '../../config/path.config';
import { ProductEntity } from '../../models/product.entity';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly _productService: ProductsService,
    ) { }

    @Post('create')
    async Create(@Headers() headers, @Body() product: ProductEntity): Promise<any> {

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
                if (product && product.codigo && product.costo && product.nombre && product.precio) {

                    // retornamos la respuesta del servicio.
                    return this._productService.CreateProduct(product,headerToken.id);
                } else {
                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultCreate: ProductEntity) => {

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
    async GetProducts(@Headers() headers, @Query() productEntity: ProductEntity): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que los datos sean los necesarios.
                if (headerToken && (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') && productEntity) {

                    // Ejecutamos el servicio de obtener sailingAnalities.
                    return this._productService.GetProducts(productEntity);

                } else {
                    // No hay limitaciones.
                    // if (Number(productEntity.) === Number(headerToken.id)) {
                        // Ejecutamos el servicio de obtener sailingAnalities.
                    //    return this._detalleService.Gets(Detalleventa);
                    // } else {
                    //    throw new Error('MISSING_FIELS');
                    // }
                    return this._productService.GetProducts(productEntity);
                }

            }
        ).then(
            (results: ProductEntity[]) => {

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
    async GetProduct(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (result: Boolean) => {

                // Convertimos a numeros.
                let productId = Number(id);

                // Validamos que los datos recibidos sean los correctos.
                if (productId && headerToken.id) {

                    // Validamos si es un admin o un support.
                    if ( headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' ) {
                        // No hacemos nada.
                    } else {
                        // caso contrario verificamos si el id es el mismo.
                        if ( headerToken.id !== id ) throw new Error('ERROR_USERID_FAIL'); // esto no deberia ir, se deeria comparar con el id user.

                        console.log('-----------------------------')
                        console.log('REVISAR este codigo 199191')
                        console.log('-----------------------------')
                        console.log('-----------------------------')
                    }

                    return this._productService.GetProduct(id);


                } else {
                    // caso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }

            }
        ).then(
            (resultGet: ProductEntity) => {

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
    async UpdateProduct(@Headers() headers, @Param('id') id, @Body() product: ProductEntity): Promise<any> {

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

                if (!isNaN(id) && product && product.codigo && product.costo && product.nombre && product.precio) {
 
                    // retornamos la respuesta del servicio.
                    return this._productService.UpdateProduct(id, product, headerToken.id);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }
            }
        ).then(
            (resultUpdate: ProductEntity) => {

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
                    return this._productService.DeleteProduct(id,headerToken.id);
                } else {
                    // aso contrario retornamos un error
                    throw new Error('MISSING_FIELS');
                }
            }
        ).then(
            (resultUpdate: ProductEntity) => {

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
