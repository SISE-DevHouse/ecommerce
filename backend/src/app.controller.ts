import { Controller, Get, Post, Body, UseGuards, Request, HttpException, HttpStatus, Param, Headers, Res, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

// modelos
import { UserEntity } from './models/user.entity';

// servicios
import { AuthService } from './components/auth/auth.service';
import { UsersService } from './components/users/users.service';

// Assets || Si es una class lo tego que poner en el constructor y como provverdor del modulo
import { DummyPromise } from './assets/promises.assets';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }


  // Guards(jwt)  valida que el token no halla caducado y exista, caso contrario invoca un error.
 // @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
 // @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {

    const user: UserEntity = req.user;

    // El dato que viene desde el parametro es cambiado por el Guards.
    return await DummyPromise().then(
      result => {
        if (!result) throw Error('Error DummyPromise()');

        if (!user) throw Error('No tiene dato el objUser');

        return this.authService.generateTokenForGuards(user);
      }
    ).then(
      (resultGenerateToken: string) => {
        if (!resultGenerateToken) throw Error('Revisar la funcion this.authService.generateTokenForGuards(req.user);');

        return {
          status: HttpStatus.CREATED,
          message: 'OK',
          data: user,
          token: resultGenerateToken
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
    );;
  }
}
