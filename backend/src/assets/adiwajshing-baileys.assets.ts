import { MessageOptions, MessageType, Mimetype, WAConnection, WAContact, WAMessage } from '@adiwajshing/baileys'
import { WhatsappContactBaileysService } from 'src/components/whatsapp-contact-baileys/whatsapp-contact-baileys.service'
import { UserEntity } from 'src/models/user.entity'
import { WhatsappContactBaileysEntity } from 'src/models/whatsapp-contact-baileys.entity'
import * as fs from 'fs';
import { join } from 'path';
import { FOLDER_PDF } from 'src/config/path.config';

//import { WhatsappContactBaileysService } from '../components/whatsapp-contact-baileys/whatsapp-contact-baileys.service'



export async function connectToWhatsApp(_WhatsappContactBaileysService: WhatsappContactBaileysService , whatsappContactBaileysEntity: WhatsappContactBaileysEntity) {
    


    const conn = new WAConnection()
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
        if (objectKey.length > 0) {
            objectKey.forEach(key => {

                // console.log(conn.contacts[key]);
                const dataCotactoWhatsapp:any = conn.contacts[key];
                let newWhatsappContactBaileysEntity : WhatsappContactBaileysEntity = new WhatsappContactBaileysEntity();
                newWhatsappContactBaileysEntity.id = null;
                
                newWhatsappContactBaileysEntity.userId = whatsappContactBaileysEntity.userId;
                newWhatsappContactBaileysEntity.wouldYouLikeToSendToThisContact = false;

                newWhatsappContactBaileysEntity.jid = dataCotactoWhatsapp.jid;
                newWhatsappContactBaileysEntity.name = dataCotactoWhatsapp.name || '';
                newWhatsappContactBaileysEntity.vname = dataCotactoWhatsapp.vname || '';
                newWhatsappContactBaileysEntity.short = dataCotactoWhatsapp.short || '';
                newWhatsappContactBaileysEntity.verify = dataCotactoWhatsapp.verify || '';
                newWhatsappContactBaileysEntity.pushname = dataCotactoWhatsapp.pushname || '';

                newWhatsappContactBaileysEntity.userIdCreated =  whatsappContactBaileysEntity.userIdCreated || 0;  
                newWhatsappContactBaileysEntity.dateCreated =   whatsappContactBaileysEntity.dateCreated ||null;  

                _WhatsappContactBaileysService.CreateContactWhatsapp(newWhatsappContactBaileysEntity);
            });
        }
        // console.log(Object.keys(conn.contacts));
    })

    await conn.connect()

    conn.on('chat-update', chatUpdate => {

        console.log('chat-update')
        // `chatUpdate` is a partial object, containing the updated properties of the chat
        // received a new message
        if (chatUpdate.messages && chatUpdate.count) {
            const message = chatUpdate.messages.all()[0]
            console.log(message)
        } else { console.log(chatUpdate) } // see updates (can be archived, pinned etc.)
    })


}
/* 
function SaveCredential(){
    conn.on ('open', () => {
        // save credentials whenever updated
        console.log (`credentials updated!`)
        const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
    })
} */

export async function SendingMessages(wAConnection:WAConnection,remoteJid:string,message:string){
    let result = await wAConnection.sendMessage (remoteJid, message, MessageType.text);
    return result;
}

export async function SendingMessageWithPdf(wAConnection:WAConnection, remoteJid:string, namePdf: string) {
    // Cargamos el archivo PDf
    const buffer = fs.readFileSync(join(FOLDER_PDF, namePdf));
  
    //let quote : WAMessage = {
    //    key:{
//
    //        /** MessageKey remoteJid */
    //        remoteJid :  null,
    //
    //        /** MessageKey fromMe */
    //        fromMe :  null,
    //
    //        /** MessageKey id */
    //        id :   null,
    //
    //        /** MessageKey participant */
    //        participant  :   null,
    //    },
    //    labels:[namePdf],
    //    
    //}

    const info: MessageOptions = {
        quoted: null, // the message you want to quote
        contextInfo: { forwardingScore: 2, isForwarded: true }, // some random context info (can show a forwarded message with this too)
        timestamp: null, // optional, if you want to manually set the timestamp of the message
        caption: "hello there!", // (for media messages) the caption to send with the media (cannot be sent with stickers though)
        thumbnail: "23GD#4/==", /*  (for location & media messages) has to be a base 64 encoded JPEG if you want to send a custom thumb, 
                                    or set to null if you don't want to send a thumbnail.
                                    Do not enter this field if you want to automatically generate a thumb
                                */
        mimetype: Mimetype.pdf, /* (for media messages) specify the type of media (optional for all media types except documents),
                                    import {Mimetype} from '@adiwajshing/baileys'
                                */
        filename: namePdf, // (for media messages) file name for the media
        /* will send audio messages as voice notes, if set to true */
        ptt: true,
        // will detect links & generate a link preview automatically (default true)
        detectLinks: true,
        /** Should it send as a disappearing messages. 
         * By default 'chat' -- which follows the setting of the chat */
        sendEphemeral: 'chat'
    }

    console.log("Se enviara el pdf");
    await wAConnection.sendMessage(
        remoteJid, 
        buffer, // load a gif and send it
        MessageType.document,
        { mimetype: Mimetype.pdf } // some metadata (can't have caption in audio)
    )
}