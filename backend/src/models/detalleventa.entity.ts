import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, Double } from 'typeorm';

@Entity('Detalleventa')
export class DetalleventaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    id_venta: number;
    
    @Column(
        { nullable: false })
    id_producto: number;
        
    @Column(
        { nullable: false })
    cantidad: number;

    @Column(
        { nullable: false })
    precio: number;

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
    id_venta?: number,
    id_producto?: number,
    cantidad?: number,
    precio?: number,
    

    //auditoria
    userIdCreated?: number,
    dateCreated?: string,
    userIdUpdated?: number,
    dateUpdated?: string,
    status?: boolean,
    ) {
        this.id = id || null;
        this.id_venta = id_venta|| null;
        this.id_producto = id_producto || null;
        this.cantidad = cantidad || 0;
        this.precio = precio|| 0;
        
        // Auditoria
        this.userIdCreated = userIdCreated || 0;
        this.dateCreated = dateCreated || '';
        this.userIdUpdated = userIdUpdated || 0;
        this.dateUpdated = dateUpdated || '';
        this.status = status || false;
    }

}
