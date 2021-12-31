import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeOrm.
import { TypeOrmModule } from '@nestjs/typeorm';
// Path.
import { SQLITE_PATH } from './config/path.config';


// Others.
import { join } from 'path';

// Aqui iran todos los modulos.
import { UsersModule } from './components/users/users.module';
import { AuthModule } from './components/auth/auth.module';
import { ProductsModule } from './components/products/products.module';
import { DetalleventasModule } from './components/detalleventas/detalleventas.module';
import { EntradaProductoModule } from './components/entrada-producto/entrada-producto.module';
import { WhatsappContactBaileysModule } from './components/whatsapp-contact-baileys/whatsapp-contact-baileys.module';

const defaultOptions = {
  type: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
};

@Module({
  imports: [
    // Conexion Pcon postgrest
    //TypeOrmModule.forRoot({
    //  type:"postgres",
    //  url: "postgres://czxzflbeobavph:cb4a7e2297451dbbbb13bea2453053917893fc8bf305c19b9926a061e1e86eb9@ec2-44-199-85-33.compute-1.amazonaws.com:5432/d2gcije7c5cj4m",
    //  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    //  synchronize: true, 
    //  port: 5432,
    //  ssl: false,
    //}),
    
    // CONEXXION SLQLITE
      TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(SQLITE_PATH, 'dbSise.sqlite3'),
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),

    //TypeOrmModule.forRoot({
    //  type: 'mysql',
    //  host: '34.123.224.207',
    //  port: 3306,
    //  username: 'cristian',
    //  password: 'adminuser',
    //  database: 'TEST_PPI_SISE',
    //  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    //  synchronize: true,
    //}),

    UsersModule,
    AuthModule,
    ProductsModule,
    DetalleventasModule,
    EntradaProductoModule,
    WhatsappContactBaileysModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
