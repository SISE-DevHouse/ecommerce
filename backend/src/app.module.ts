import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm';
// Path
import { SQLITE_PATH } from './config/path.config';


// Others
import { join } from 'path';

@Module({
  imports: [   
    TypeOrmModule.forRoot({
    type: 'sqlite',
    database: join(SQLITE_PATH, 'dbSise.sqlite3'),
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
  })
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
