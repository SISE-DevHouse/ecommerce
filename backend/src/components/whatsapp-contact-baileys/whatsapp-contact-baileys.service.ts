import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappContactBaileysEntity } from 'src/models/whatsapp-contact-baileys.entity';
import { Repository } from 'typeorm';
import { MessageType, WAConnection, WAContact } from '@adiwajshing/baileys';
import * as fs from 'fs';
import { SendDialogFlow } from 'src/assets/dialogflow.assets';
import { SendingMessages, SendingMessageWithPdf } from 'src/assets/adiwajshing-baileys.assets';

@Injectable()
export class WhatsappContactBaileysService {


    constructor(
        @InjectRepository(WhatsappContactBaileysEntity)
        private _WContactBRepository: Repository<WhatsappContactBaileysEntity>,
    ) { }


    // public WAConnection:[WAConnection] = [new WAConnection()];
    public _WAConnection = new WAConnection();

    // Registra un nuevo viaje
    public async CreateContactWhatsapp(wContactB: WhatsappContactBaileysEntity): Promise<WhatsappContactBaileysEntity> {


        // Hacemos where por todos los campos de la entidad
        return await this._WContactBRepository.find({
            where: [
                // name && surname && nick && email
                {
                    jid: wContactB.jid,
                }
            ],
            take: 1,
            order: {
                id: 'DESC',
            }
        }).then(
            (result: WhatsappContactBaileysEntity[]) => {
                // result length 
                if (!result || result.length > 0) {
                    console.log('Este contacto ya se encuentra registrado.')
                    return {};
                }

                // No lo validamos por que puede llegar vacio.
                return this._WContactBRepository.save(wContactB)
            }
        ).then(
            (resultSave: WhatsappContactBaileysEntity) => {
                // Validamos si encontro al usuario.
                if (!resultSave) throw new Error('Valor no esperado, revisar la funcion save');

                return resultSave;
            }
        );

    }

    // enviar mensaje por Whatsapp
    public async NewConnectToWhatsApp(whatsappContactBaileysEntity: WhatsappContactBaileysEntity) {



        const conn = this._WAConnection;

        let registrarContactoSoloUnaVez = true;
        // called when WA sends chats
        // this can take up to a few minutes if you have thousands of chats!
        conn.on('chats-received', async ({ hasNewChats }) => {
            console.log('chat-received')
            console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

            const unread = await conn.loadAllUnreadMessages()
            console.log("you have " + unread.length + " unread messages")
        })

        // called when WA sends chats
        // this can take up to a few minutes if you have thousands of contacts!
        conn.on('contacts-received', () => {
            console.log('contacts-received')
            console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')

            // Obtenemos el arreglo con los key
            let objectKey = Object.keys(conn.contacts);
            if (registrarContactoSoloUnaVez && objectKey.length > 0) {
                objectKey.forEach(key => {

                    // console.log(conn.contacts[key]);
                    const dataCotactoWhatsapp: any = conn.contacts[key];
                    let newWhatsappContactBaileysEntity: WhatsappContactBaileysEntity = new WhatsappContactBaileysEntity();
                    newWhatsappContactBaileysEntity.id = null;

                    newWhatsappContactBaileysEntity.userId = whatsappContactBaileysEntity.userId;
                    newWhatsappContactBaileysEntity.wouldYouLikeToSendToThisContact = false;

                    newWhatsappContactBaileysEntity.jid = dataCotactoWhatsapp.jid;
                    newWhatsappContactBaileysEntity.name = dataCotactoWhatsapp.name || '';
                    newWhatsappContactBaileysEntity.vname = dataCotactoWhatsapp.vname || '';
                    newWhatsappContactBaileysEntity.short = dataCotactoWhatsapp.short || '';
                    newWhatsappContactBaileysEntity.verify = dataCotactoWhatsapp.verify || '';
                    newWhatsappContactBaileysEntity.pushname = dataCotactoWhatsapp.pushname || '';

                    newWhatsappContactBaileysEntity.userIdCreated = whatsappContactBaileysEntity.userIdCreated || 0;
                    newWhatsappContactBaileysEntity.dateCreated = whatsappContactBaileysEntity.dateCreated || null;

                    this.CreateContactWhatsapp(newWhatsappContactBaileysEntity);
                });
            }
            // Esto lo hago para que cuando nos volvamos a conectar no se registren los datos.
            registrarContactoSoloUnaVez = false;
            // console.log(Object.keys(conn.contacts));
        })


        conn.on('chat-update', chatUpdate => {

            console.log('chat-update')
            // `chatUpdate` is a partial object, containing the updated properties of the chat
            // received a new message
            if (chatUpdate.messages && chatUpdate.count) {
                const message = chatUpdate.messages.all()[0]
                console.log(JSON.stringify(message))
            } else { console.log(chatUpdate) } // see updates (can be archived, pinned etc.)
        })

        // this will be called as soon as the credentials are updated
        conn.on('open', () => {
            // save credentials whenever updated
            console.log(`credentials updated!`)
            const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
            fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
        })

        try {
            const path = './auth_info.json';
            if (fs.existsSync(path)) {
                //file exists
                conn.loadAuthInfo('./auth_info.json')
            }
        } catch (err) {
            console.log(' no existe el archivo')
            console.log(err);

        }


        // AGREGAR ESCUAH DE ALGUN NUEVO MENSAJE QUE AN ENVIADO LAS CLIENTITAS
        await conn.connect()

        /// ESCUCHAMOS CUALQUIER MENSAJE INGRESADO
        conn.on('chat-update', chatUpdate => {
            // `chatUpdate` is a partial object, containing the updated properties of the chat
            // received a new message
            if (chatUpdate.messages && chatUpdate.count) {
                const messageInfo = chatUpdate.messages.all()[0]
                //
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');

                if (messageInfo) {
                    // El remoteJID es su identificador
                    let remoteJid = '';
                    // mensaje de la conversacion
                    let conversation = '';
                    if (messageInfo.message && messageInfo.message.conversation) {
                        conversation = messageInfo.message.conversation;
                    }
                    if (messageInfo.key && messageInfo.key.remoteJid) {
                        remoteJid = messageInfo.key.remoteJid;
                    }
                    // Verificamos que tenga un meensaje y un id para enviar a dialogflow
                    if(remoteJid&&conversation){

                        console.log('remoteJid :'+remoteJid+'\n conversation :'+conversation);

                        SendDialogFlow(remoteJid, conversation).then(
                            (result) => {
                                // Si existe un resultado enviamos un mensaje.
                                if (result) {
        
                                    // la CLAVE DE MI AMOR
                                    if (result === "TEAMO") { 
                                    
                                        SendingMessages(
                                            this._WAConnection,
                                            remoteJid, 
                                            "Un gusto poder brindarte los catálogos 🥰, este proceso tardara unos minutos solo espere.⏳🙏").then(
                                                result => {
                                                        console.log(result)
                                                    return SendingMessages(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "👇 AQUI te estoy enviando el *Catalogo PRECIO por MAYOR*👀");
                                                }
                                            ).then(
                                                result => {
                                                    console.log(result)
                                                    return SendingMessageWithPdf(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "Precio-Por-Mayor-ForHer-Zapatilla-2021.pdf");
                                                }
                                            ).then(
                                                result => {
                                                    console.log(result)
        
                                                    return SendingMessages(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "👇 AQUI te estoy enviando el *Catalogo SIN PRECIO*👀");
                                                }
                                            ).then(
                                                result => {
                                                    console.log(result)
                                                    return SendingMessageWithPdf(
                                                        this._WAConnection,
                                                        remoteJid,
                                                        "Sin-Precio-Zapatilla-2021.pdf");
                                                }
                                            ).then(
                                                result => {
        
                                                    console.log(result)
                                                    return SendingMessages(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "👇 AQUI te estoy enviando el *Catalogo PRECIO por UNIDAD*👀");
                                                }
                                            ).then(
                                                result => {
                                                    console.log(result)
                                                    return SendingMessageWithPdf(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "Precio-Unidad-Zapatilla-2021.pdf");
                                                }
                                            ).then(
                                                result => {
                                                    console.log(result)
        
                                                    return SendingMessages(
                                                        this._WAConnection,
                                                        remoteJid,
                                                         "🌈 *Tal vez esto te pueda ayudar*  👇😉 \n *opción2*\n ```¿Cómo realizo mi pedido?```  🙌\n*opción3*\n```Proceso de cotización```  🤩\n( Escoge una opción y por ejemplo escribe *opción2* 👇  )");
                                                }
                                            ) 
        
                                    } else {
                                      SendingMessages(this._WAConnection,remoteJid,result);
                                    }

                                }
                            }
                        );
                    }



                }



                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');
                console.log('--------------------------');


            } else console.log(chatUpdate) // see updates (can be archived, pinned etc.)
        });

    }

   
}
