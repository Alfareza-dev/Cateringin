import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  // Swagger OpenAPI Config
  const config = new DocumentBuilder()
    .setTitle('Catering Platform API')
    .setDescription('Backend REST API documentation for Daily Catering & Order System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Docs Route
  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
    } as any),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📄 Scalar API Documentation: http://localhost:${port}/docs`);
}
bootstrap();
