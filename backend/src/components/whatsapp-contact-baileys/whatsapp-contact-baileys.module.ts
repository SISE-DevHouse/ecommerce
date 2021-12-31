import { Module } from '@nestjs/common';
import { WhatsappContactBaileysService } from './whatsapp-contact-baileys.service';
import { WhatsappContactBaileysController } from './whatsapp-contact-baileys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsappContactBaileysEntity } from 'src/models/whatsapp-contact-baileys.entity';


@Module({
  providers: [WhatsappContactBaileysService],
  controllers: [WhatsappContactBaileysController],
  //Importamos el TypeOrm con el modulo a usar, para que funcione en el servicio.
  imports: [
    TypeOrmModule.forFeature([WhatsappContactBaileysEntity]),
  ],
  // Exportamos el servicio para que lo usemos desde otro lado.
  exports: [WhatsappContactBaileysService],
})
export class WhatsappContactBaileysModule {}
