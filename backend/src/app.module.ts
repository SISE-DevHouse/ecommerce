import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config/constants';

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
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>(DB_HOST),
        port: +configService.get<number>(DB_PORT),
        username: configService.get<string>(DB_USER),
        password: configService.get<string>(DB_PASSWORD),
        database: configService.get<string>(DB_DATABASE),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),


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
    //  TypeOrmModule.forRoot({
    //  type: 'sqlite',
    //  database: join(SQLITE_PATH, 'dbSise.sqlite3'),
    //  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    //  synchronize: true,
    //}),

    //TypeOrmModule.forRoot({
    //  type: 'mysql',
    //  host: 'us-cdbr-east-05.cleardb.net',
    //  //port: 5000,
    //  username: 'bcb3797ad36eeb',
    //  password: 'a8c7770b',
    //  database: 'heroku_c94fcd1a4e98e7c',
    //  entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    //  //autoLoadEntities: true,
    //  //synchronize en false en produccion
    //  synchronize: true,
    //  
    //}),
    

    UsersModule,
    AuthModule,
    ProductsModule,
    DetalleventasModule,
    EntradaProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
