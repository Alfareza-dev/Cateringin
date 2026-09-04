import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Global()
@Module({
  imports: [
    MulterModule.register({ dest: '/tmp' }), // Buffer dipakai, dest hanya fallback
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
