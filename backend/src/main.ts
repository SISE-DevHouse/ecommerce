import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SERVER_PORT } from './config/constants';
import { DialogFlowInit } from './assets/dialogflow.assets';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //server port
  const configService = app.get(ConfigService);
  //
  const port = +configService.get<number>(SERVER_PORT) || 5000;

  app.enableCors();
  

  

  
  // Inicializamos DialogFlow
  DialogFlowInit();

  const options = {
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    'credentials': true,
  };
  
  // Habilitamos el CORS
  // app.use(cors(options))
  app.enableCors(options);

  
  await app.listen(process.env.PORT || (port));
  console.log(`listenig on port ${await app.getUrl()}`)
}
bootstrap();
