import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './shared/Config/config.service';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as apm from 'swagger-stats';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Initialize the cookieParser
  app.use(cookieParser());

  // Initialize middleware functions that set security-related HTTP headers from helmet
  app.use(helmet());

  // Initialize the Cross-site request blocker
  // app.use(csurf({ cookie: true }));

  const paths = ['/users/', '/categories/', '/entries/', '/products/'];

  // Configure the brute-force defender [values will change for production]
  for (const path of paths) {
    app.use(path,
      rateLimit({
        windowMs: 60 * 1000,
        max: 100,
      }),
    );
  }

  app.use('/auth/',
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  // Configure the APM


  const apmConfig = {
    authentication: true,
    onAuthenticate(req, username, password) {
      // simple check for username and password
      return ((username === configService.get('APM_USERNAME')) && (password === configService.get('APM_PASSWORD')));
    },
    uriPath: '/api-status',
    version: '0.95.11',
  };

  // Initialize the APM
  app.use(apm.getMiddleware(apmConfig));

  await app.listen(configService.get('APP_PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
