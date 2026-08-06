import { Controller, Get, Patch, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KitchenService } from './kitchen.service';
import { BatchViewQueryDto, StartCookingDto, LabelQueryDto } from './dto/batch-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Kitchen')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.KITCHEN, Role.ADMIN)
@Controller('kitchen')
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get('batch-view')
  @ApiOperation({ summary: 'Get aggregated production query for a specific date and slot' })
  async getBatchView(@Query() query: BatchViewQueryDto) {
    return this.kitchenService.getBatchView(query.date, query.slotId);
  }

  @Patch('batch/start-cooking')
  @ApiOperation({ summary: 'Transition order statuses from PAID to IN_KITCHEN for a batch' })
  async startCookingBatch(@Body() body: StartCookingDto) {
    return this.kitchenService.startCookingBatch(body.date, body.slotId);
  }

  @Get('labels')
  @ApiOperation({ summary: 'Generate shipping labels for a specific date and slot' })
  async getLabels(@Query() query: LabelQueryDto) {
    return this.kitchenService.getLabels(query.date, query.slotId);
  }

  @Get('orders/:id/label')
  @ApiOperation({ summary: 'Get single printable label for a specific order' })
  async getSingleLabel(@Param('id') id: string) {
    return this.kitchenService.getSingleLabel(id);
  }
}
