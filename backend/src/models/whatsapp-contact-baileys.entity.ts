import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('WhatsappContactBaileys')
export class WhatsappContactBaileysEntity {

    @PrimaryGeneratedColumn()
    id: number;

    // Persona a la quien le pertenece el contato
    @Column({ nullable: false,default:  0 })
    userId: number;
    // Si se desea usar este contacto es necesario dale check
    @Column({ nullable: false, default: false })
    wouldYouLikeToSendToThisContact: boolean;

    // Identificador que usar bailey para enviar un mensaje
    @Column({ nullable: false })
    jid: string;
    // Nombre que se registro
    @Column({ nullable: true })
    name: string;
    // Nombre de empresa
    @Column({ nullable: true })
    vname: string;
    // Contact Name in Short
    @Column({ nullable: true })
    short: string;
    // Nombre que pusieron al registrarse por primera vez
    @Column({ nullable: true })
    pushname: string;
    // Si la cuenta es verificada.
    @Column({ nullable: true })
    verify: string;

    
    // Auditoria
    @Column()
    userIdCreated: number;
    @Column()
    dateCreated: string;
    @Column({ nullable: true })
    userIdUpdated: number;
    @Column({ nullable: true })
    dateUpdated: string;

    @Column({ nullable: false })
    status: boolean;

    constructor(
        id?: number,
        userId?: number,
        wouldYouLikeToSendToThisContact?: boolean,
        jid?: string,
        name?: string,
        vname?: string,
        short?: string,
        pushname?: string,
        verify?: string,
        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,
        status?: boolean

    ) {
        this.id = id || 0;
        this.userId = userId || 0;
        this.wouldYouLikeToSendToThisContact = wouldYouLikeToSendToThisContact || false;
        this.jid = jid || '';
        this.name = name || '';
        this.vname = vname || '';
        this.short = short || '';
        this.pushname = pushname || '';
        this.verify = verify || '';
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }


}
