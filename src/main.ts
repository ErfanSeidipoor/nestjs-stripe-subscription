import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'body-parser';
import { AppModule } from './app.module';
import { urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors();

  app.use((req, res, next) => {
    console.log('req.originalUrl', req.originalUrl);

    if (req.originalUrl === '/stripe/webhook') {
      return json({
        verify: (
          req: Request & { rawBody?: Buffer },
          res: Response,
          buf: Buffer,
        ) => {
          console.log('verify', { req, buf });
          req.rawBody = buf;
        },
        type: 'application/json',
      })(req, res, next);
    } else {
      return json()(req, res, () =>
        urlencoded({ extended: true })(req, res, next),
      );
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nest Stripe API')
    .setDescription('NestJS application with Stripe integration')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`🚀 Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();
