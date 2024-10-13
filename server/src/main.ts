import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const envFilePath = path.resolve(__dirname, `../${env}.env`);

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  } else {
    console.warn(
      `Environment file ${envFilePath} not found, falling back to defaults.`,
    );
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('DNUChoice API')
    .setDescription('DNUChoice API on NestJS.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'eyJhbGciOiJIUzI1NiJ9.ZXhhbXBsZmZlQGV4YW1wbGUuY29t.9AG7RC9_qiSg284LNs_HGZU0fMJ4Bz6v89qlkpE-OU0',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      security: [{ bearer: [] }],
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
