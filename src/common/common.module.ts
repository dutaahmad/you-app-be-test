// src/common/common.module.ts
import { Module } from "@nestjs/common";
import { EncryptionHashService } from "./encryption-hash/encryption-hash.service";

@Module({
  providers: [EncryptionHashService],
  exports: [EncryptionHashService]
})
export class CommonModule {}
