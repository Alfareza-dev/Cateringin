import { Body, Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CalculateCartDto } from './dto/calculate-cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate subscription price and delivery fee' })
  @ApiResponse({ status: 200, description: 'Calculation successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async calculate(@Body() calculateCartDto: CalculateCartDto, @Request() req: any) {
    const userId = req.user.id;
    const result = await this.cartService.calculate(userId, calculateCartDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Cart calculated successfully',
      data: result,
    };
  }
}
