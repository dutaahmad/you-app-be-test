import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: "*"
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
