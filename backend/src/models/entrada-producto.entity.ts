import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, Double } from 'typeorm';

@Entity('entradaproducto')
export class EntradaProductoEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column(
        // Puede ser null falso
        { nullable: false })
    idProducto: number; 

    @Column(
        // Puede ser null falso
        { nullable: false })
    cantidad: number; 
    
    @Column(
        // Puede ser null falso
        { nullable: false })
    costo_unitario: number; 
    
    @Column(
        // Puede ser null falso
        { nullable: false })
    fecha: string; 

    
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
}
