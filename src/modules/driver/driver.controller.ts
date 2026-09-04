import { Controller, Get, Patch, Query, Body, Param, UseGuards, Post, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import { UploadService } from '../upload/upload.service';
import { DeliveryQueryDto, UpdateDeliveryStatusDto } from './dto/driver-action.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Driver')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DRIVER, Role.ADMIN)
@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('deliveries')
  @ApiOperation({ summary: 'Fetch all deliveries for a specific date and slot' })
  async getDeliveries(@Query() query: DeliveryQueryDto) {
    // If date is omitted, default to today's date in YYYY-MM-DD
    let targetDate = query.date;
    if (!targetDate) {
      // Create local date string for Asia/Jakarta (approximate today string)
      const now = new Date();
      // Using en-CA for YYYY-MM-DD format
      targetDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
    }
    
    return this.driverService.getDeliveries(targetDate, query.slotId);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update delivery status (ON_DELIVERY or DELIVERED)' })
  async updateDeliveryStatus(
    @Param('id') id: string,
    @Body() body: UpdateDeliveryStatusDto,
  ) {
    return this.driverService.updateDeliveryStatus(id, body.status, body.proofOfDelivery);
  }

  @Post('upload-proof')
  @ApiOperation({ summary: 'Upload proof of delivery image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this.uploadService.uploadImage(file, 'cateringin/proofs');
    return { url };
  }
}
