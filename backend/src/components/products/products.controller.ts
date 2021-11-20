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
import { ProductEntity } from 'src/models/product.entity';

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

                    product.userIdCreated = headerToken.id;
                    product.dateCreated = GetDate();
                    delete product.userIdUpdated;
                    delete product.dateUpdated;
                    product.status = Boolean(product.status);

                    // retornamos la respuesta del servicio.
                    return this._productService.CreateProduct(product);
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
}
