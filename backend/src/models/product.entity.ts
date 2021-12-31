import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, Double } from 'typeorm';

@Entity('productos')
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    codigo: number; 

    @Column(
        // Puede ser null falso
        { nullable: false })
    nombre: string;

    @Column(
        // Puede ser null falso
        { nullable: false })
    descripcion: string;

    @Column(
        // Puede ser null falso
        { nullable: false })
    costo: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    precio: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    stock: number;


    //auditoria
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
    codigo?: number,
    
    idcategoria?: number,
    nombre?: string,
    descripcion?: string,
    costo?: number,
    precio?: number,
    stock?: number,


    //auditoria
    userIdCreated?: number,
    dateCreated?: string,
    userIdUpdated?: number,
    dateUpdated?: string,
    status?: boolean,
    ) {
        this.id = id || null;
        this.codigo = codigo|| 0;
        this.nombre = nombre || '';
        this.descripcion = descripcion|| '';
        this.costo = costo|| 0;
        this.precio = precio|| 0;
        this.stock = stock|| 0;

        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

}
