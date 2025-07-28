import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  async create(@Body() body) {
    return this.service.create(body);
  }

  @Get()
  async findAll(@Query() filters) {
    return this.service.findAll(filters);
  }

  @Get('stats')
  async stats() {
    return this.service.stats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
