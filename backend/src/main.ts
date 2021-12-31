import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DialogFlowInit } from './assets/dialogflow.assets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
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

  
  await app.listen(3001);
}
bootstrap();
