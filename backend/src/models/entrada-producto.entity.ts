import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, Double } from 'typeorm';

@Entity('EntradaProducto')
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
}
