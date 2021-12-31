import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { connectToWhatsApp } from 'src/assets/adiwajshing-baileys.assets';
import { GetDate } from 'src/assets/moment.assets';
import { DummyPromise } from 'src/assets/promises.assets';
import { UserEntity } from 'src/models/user.entity';
import { WhatsappContactBaileysEntity } from 'src/models/whatsapp-contact-baileys.entity';
import { WhatsappContactBaileysService } from './whatsapp-contact-baileys.service';

@Controller('whatsapp-contact-baileys')
export class WhatsappContactBaileysController {
    constructor(
        private readonly _WhatsappContactBaileysService: WhatsappContactBaileysService,
    ) { }


    
  @Post('newConection')
  newConection(@Body() whatsappContactBaileysEntity: WhatsappContactBaileysEntity):Promise<string>{


    return DummyPromise().then(
      result => {

        // revisar falta enviar los datos e auditoria
        whatsappContactBaileysEntity.userIdCreated =  0;  
        whatsappContactBaileysEntity.dateCreated =  GetDate();
        // return connectToWhatsApp(this._WhatsappContactBaileysService,whatsappContactBaileysEntity)      
        return this._WhatsappContactBaileysService.NewConnectToWhatsApp(whatsappContactBaileysEntity);

      }
     ).then(
       result => {
            
            return 'ok';
      
  
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
