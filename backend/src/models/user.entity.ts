import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('usuario')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    nick: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    phoneNumber: string;



    @Column({ nullable: true })
    filename: string;


    @Column({ nullable: false })
    password: string;


    @Column({ nullable: true })
    language: string;

    @Column({ nullable: false })
    role: string;


    // Campos de auditoria.
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

        nick?: string,
        name?: string,
        lastName?: string,
        phoneNumber?: string,

        filename?: string,
        password?: string,

        language?: string,
        role?: string,

        // Auditoria
        userIdCreated?: number,
        dateCreated?: string,
        userIdUpdated?: number,
        dateUpdated?: string,
        status?: boolean,
    ) {
        this.id = id || null;

        this.nick = nick || '';
        this.name = name || '';
        this.lastName = lastName || '';
        this.phoneNumber = phoneNumber || '';

        this.filename = filename || '';
        this.password = password || '';

        this.language = language || '';
        this.role = role || '';

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

}
