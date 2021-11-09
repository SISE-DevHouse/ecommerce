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

@Module({
  imports: [   
    TypeOrmModule.forRoot({
    type: 'sqlite',
    database: join(SQLITE_PATH, 'dbSise.sqlite3'),
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
  }), 
  
  UsersModule,
  AuthModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
