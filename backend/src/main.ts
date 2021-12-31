import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //server port
  const configService = app.get(ConfigService);
  //
  const port = +configService.get<number>(SERVER_PORT) || 5000;

  app.enableCors();
  await app.listen(process.env.PORT || (port));
  console.log(`listenig on port ${await app.getUrl()}`)
}
bootstrap();
