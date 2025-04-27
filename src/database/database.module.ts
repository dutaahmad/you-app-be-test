import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { databaseSchemas } from "./schemas";

@Global()
@Module({
  imports: [MongooseModule.forFeature(databaseSchemas)],
  exports: [MongooseModule]
})
export class DatabaseModule {}
